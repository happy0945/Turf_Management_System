import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  FaCheckCircle, FaClock,
  FaCreditCard, FaSpinner, FaExclamationCircle, FaLock
} from "react-icons/fa";
import { turfService, type Turf, type TimeSlot } from "../../../services/turfService";
import { bookingService, type Booking } from "../../../services/bookingService";
import { useAuth } from "../../../context/AuthContext";

// Helper to load Razorpay Checkout script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Generate next 7 days for the slot picker
const getNext7Days = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const rawDate = d.toISOString().split("T")[0];
    days.push({
      rawDate,
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString("en-US", { month: "short" }),
      year: d.getFullYear(),
    });
  }
  return days;
};

const TurfBook = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  const preselectedTurfId = searchParams.get("turfId");

  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [loadingTurfs, setLoadingTurfs] = useState(true);

  const daysList = getNext7Days();
  const [selectedDate, setSelectedDate] = useState<string>(daysList[0].rawDate);

  // Custom slot duration state (30, 60, 90, 120 mins)
  const [selectedDuration, setSelectedDuration] = useState<number>(60);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Booking process state
  const [step, setStep] = useState<"SELECT" | "CONFIRM" | "SUCCESS">("SELECT");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // 1. Load Turfs
  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoadingTurfs(true);
        const data = await turfService.getAllTurfs();
        setTurfs(data);

        if (preselectedTurfId) {
          const match = data.find((t) => t._id === preselectedTurfId);
          if (match) {
            setSelectedTurf(match);
            setSelectedDuration(match.slotDuration || 60);
          } else if (data.length > 0) {
            setSelectedTurf(data[0]);
            setSelectedDuration(data[0].slotDuration || 60);
          }
        } else if (data.length > 0) {
          setSelectedTurf(data[0]);
          setSelectedDuration(data[0].slotDuration || 60);
        }
      } catch {
        setErrorMsg("Failed to load turfs. Please refresh.");
      } finally {
        setLoadingTurfs(false);
      }
    };
    fetchTurfs();
  }, [preselectedTurfId]);

  // When turf selection changes, sync slot duration
  const handleSelectTurf = (turf: Turf) => {
    setSelectedTurf(turf);
    setSelectedDuration(turf.slotDuration || 60);
    setSelectedSlot(null);
  };

  // 2. Fetch slots whenever selectedTurf or selectedDate changes
  useEffect(() => {
    if (!selectedTurf) return;
    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        setSelectedSlot(null);
        setErrorMsg(null);
        const data = await turfService.getAvailableSlots(selectedTurf._id, selectedDate);
        setSlots(data);
      } catch (err: any) {
        setErrorMsg(err?.response?.data?.message || "Failed to load slots for selected date.");
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [selectedTurf, selectedDate]);

  // Handle booking creation & payment modal launch
  const handleCreateBooking = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!selectedTurf || !selectedSlot) return;

    setErrorMsg(null);
    setIsProcessing(true);

    try {
      // Step 1: Create pending booking & Razorpay order on backend
      const { booking, razorpayOrder } = await bookingService.createBooking({
        turfId: selectedTurf._id,
        bookingDate: selectedDate,
        startTime: selectedSlot,
        slotDuration: selectedDuration,
      });

      // Step 2: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // Step 3: Open Razorpay Modal
      const options = {
        key: razorpayOrder.keyId || "rzp_test_TGBaOxpS9AvteF",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "TurfHub",
        description: `Booking for ${selectedTurf.turfName} (${selectedDuration} mins)`,
        order_id: razorpayOrder.orderId,
        prefill: {
          name: user?.fullName || "",
          email: user?.emailId || "",
          contact: user?.contactNumber || "",
        },
        theme: {
          color: "#22c55e",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI / QR Code",
                instruments: [
                  { method: "upi" },
                  { method: "card" },
                  { method: "netbanking" },
                ],
              },
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async (response: any) => {
          try {
            setIsProcessing(true);
            // Step 4: Verify payment on backend
            const confirmed = await bookingService.verifyPayment({
              bookingId: booking._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setConfirmedBooking(confirmed);
            setStep("SUCCESS");
          } catch (verifyErr: any) {
            setErrorMsg(
              verifyErr?.response?.data?.message || "Payment verification failed. Please contact support."
            );
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || err.message || "Failed to initialize booking."
      );
      setIsProcessing(false);
    }
  };

  if (loadingTurfs) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-28 pb-20 flex flex-col items-center justify-center gap-4">
        <FaSpinner className="text-green-500 text-4xl animate-spin" />
        <p className="text-slate-500 font-semibold">Loading booking portal...</p>
      </div>
    );
  }

  // Calculate dynamic price & end time based on selectedDuration
  const baseDuration = selectedTurf?.slotDuration || 60;
  const priceRatio = selectedDuration / baseDuration;
  const calculatedPrice = selectedTurf ? Math.round(selectedTurf.pricePerSlot * priceRatio) : 0;

  const calculateEndTime = (start: string, duration: number) => {
    const [h, m] = start.split(":").map(Number);
    const totalMins = h * 60 + m + duration;
    const endH = Math.floor(totalMins / 60) % 24;
    const endM = totalMins % 60;
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-28 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">
            Reserve Your{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Slot
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Select venue, date, custom duration, and slot time for instant booking
          </p>
        </motion.div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 font-semibold text-sm flex items-center gap-3">
            <FaExclamationCircle className="flex-shrink-0 text-lg" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 3: SUCCESS Confirmation Receipt */}
        {step === "SUCCESS" && confirmedBooking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl text-center space-y-6"
          >
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto text-3xl">
              <FaCheckCircle />
            </div>

            <div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-1">
                Booking Confirmed! 🎉
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A confirmation email &amp; SMS has been sent to your registered contact.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl text-left space-y-3 border border-slate-100 dark:border-slate-800 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Booking ID:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white">{confirmedBooking._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {new Date(confirmedBooking.bookingDate).toDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Slot Time:</span>
                <span className="font-bold text-green-500">
                  {confirmedBooking.startTime} – {confirmedBooking.endTime} ({confirmedBooking.slotDuration || selectedDuration} mins)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-black text-slate-800 dark:text-white">₹{confirmedBooking.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Status:</span>
                <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 font-bold text-xs uppercase">
                  {confirmedBooking.payment.status}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to="/profile"
                className="flex-1 py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition text-center text-sm shadow-md shadow-green-500/20"
              >
                View My Reservations
              </Link>
              <button
                onClick={() => {
                  setStep("SELECT");
                  setConfirmedBooking(null);
                  setSelectedSlot(null);
                }}
                className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition text-sm cursor-pointer"
              >
                Book Another Slot
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 1 & 2: Selection & Confirmation Flow */}
        {step !== "SUCCESS" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Turf Selector, Duration Picker & Slot Grid */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Turf Selector Dropdown */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Sports Facility
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {turfs.map((turf) => (
                    <button
                      key={turf._id}
                      onClick={() => handleSelectTurf(turf)}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-center gap-3 ${
                        selectedTurf?._id === turf._id
                          ? "border-green-500 bg-green-500/5 ring-2 ring-green-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-green-500/40"
                      }`}
                    >
                      <img
                        src={turf.images?.[0]?.url || "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=100"}
                        alt={turf.turfName}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{turf.turfName}</h4>
                        <p className="text-xs text-slate-400 truncate">{turf.location.city}</p>
                        <p className="text-xs font-extrabold text-green-500 mt-0.5">₹{turf.pricePerSlot} / {turf.slotDuration}m</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ══ SLOT DURATION SELECTOR (30m, 60m, 90m, 120m) ════════════════ */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Slot Duration
                  </label>
                  <span className="text-xs font-bold text-green-500">
                    Selected: {selectedDuration} Minutes
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { dur: 30, label: "30 Mins" },
                    { dur: 60, label: "60 Mins (1 Hr)" },
                    { dur: 90, label: "90 Mins (1.5 Hrs)" },
                    { dur: 120, label: "120 Mins (2 Hrs)" },
                  ].map((opt) => (
                    <button
                      key={opt.dur}
                      type="button"
                      onClick={() => setSelectedDuration(opt.dur)}
                      className={`py-3 px-3 rounded-2xl text-xs font-black transition cursor-pointer text-center border ${
                        selectedDuration === opt.dur
                          ? "border-green-500 bg-green-500 text-white shadow-md shadow-green-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-green-500/40"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selector (7 Days) */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Booking Date
                </label>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {daysList.map((day) => (
                    <button
                      key={day.rawDate}
                      onClick={() => setSelectedDate(day.rawDate)}
                      className={`flex flex-col items-center min-w-[70px] p-3 rounded-2xl border transition cursor-pointer flex-shrink-0 ${
                        selectedDate === day.rawDate
                          ? "bg-gradient-to-b from-green-500 to-emerald-600 text-white border-green-500 shadow-md shadow-green-500/20"
                          : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-green-500/40"
                      }`}
                    >
                      <span className="text-[10px] font-bold opacity-80">{day.dayName}</span>
                      <span className="text-xl font-black">{day.dayNum}</span>
                      <span className="text-[10px] font-bold opacity-80">{day.monthName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Available Time Slots
                  </label>
                  {selectedSlot && (
                    <span className="text-xs font-bold text-green-500">
                      Selected: {selectedSlot} – {calculateEndTime(selectedSlot, selectedDuration)}
                    </span>
                  )}
                </div>

                {loadingSlots ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                    <FaSpinner className="animate-spin text-2xl text-green-500" />
                    <span className="text-xs font-semibold">Checking slot availability...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-sm font-medium">
                    No available slots for this date. Please try selecting another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot === slot.startTime;
                      return (
                        <button
                          key={slot.startTime}
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot.startTime)}
                          className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-0.5 cursor-pointer ${
                            !slot.isAvailable
                              ? "bg-slate-100 dark:bg-slate-800/40 text-slate-400 line-through cursor-not-allowed border border-transparent"
                              : isSelected
                              ? "bg-green-500 text-white shadow-md shadow-green-500/20 border border-green-500 scale-105"
                              : "bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-green-500/40"
                          }`}
                        >
                          <span>{slot.startTime}</span>
                          <span className="text-[9px] font-normal opacity-80">
                            {slot.isAvailable ? "Available" : "Booked"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Dynamic Order Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl sticky top-28 space-y-6">
                <h3 className="text-xl font-black text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                  Reservation Summary
                </h3>

                {selectedTurf ? (
                  <div className="space-y-4">
                    <div className="flex gap-3 items-center">
                      <img
                        src={selectedTurf.images?.[0]?.url || "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=100"}
                        alt={selectedTurf.turfName}
                        className="w-14 h-14 rounded-2xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-base">{selectedTurf.turfName}</h4>
                        <p className="text-xs text-slate-400">{selectedTurf.location.address}, {selectedTurf.location.city}</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400">Date:</span>
                        <span className="font-bold">{new Date(selectedDate).toDateString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400">Time Slot:</span>
                        <span className="font-bold text-green-500">
                          {selectedSlot
                            ? `${selectedSlot} – ${calculateEndTime(selectedSlot, selectedDuration)}`
                            : "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400">Duration:</span>
                        <span className="font-bold text-slate-800 dark:text-white">{selectedDuration} Minutes</span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-300">
                        <span className="text-slate-400">Base Price:</span>
                        <span>₹{selectedTurf.pricePerSlot} / {selectedTurf.slotDuration}m</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">Total Amount:</span>
                      <span className="text-3xl font-black text-green-500">
                        ₹{selectedSlot ? calculatedPrice : selectedTurf.pricePerSlot}
                      </span>
                    </div>

                    <button
                      disabled={!selectedSlot || isProcessing}
                      onClick={handleCreateBooking}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 text-white font-black text-base rounded-2xl shadow-lg shadow-green-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isProcessing ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <FaCreditCard />
                          <span>Proceed to Pay</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold pt-1">
                      <FaLock className="text-green-500" />
                      <span>Secured by Razorpay • Instant Confirmation</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">Please select a turf facility to see summary.</p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TurfBook;