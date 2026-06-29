import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaCheckCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaDownload,
  FaArrowRight,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";
import { turfCatalogData } from "./HomePage/turfCatalogData";
import type { TurfItem } from "./HomePage/turfCatalogData";
import Tilt from "./HomePage/Tilt";

// Generate next 7 days for the slot picker
const getNext7Days = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      rawDate: d.toISOString().split("T")[0],
      dayName: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      dayNum: d.getDate(),
      monthName: d.toLocaleDateString("en-US", { month: "short" }),
      year: d.getFullYear(),
    });
  }
  return days;
};

const formatDateFriendly = (dateStr: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Time Slots list
const TIME_SLOTS = [
  { id: "s1", time: "06:00 AM - 08:00 AM", period: "Morning" },
  { id: "s2", time: "08:00 AM - 10:00 AM", period: "Morning" },
  { id: "s3", time: "10:00 AM - 12:00 PM", period: "Morning" },
  { id: "s4", time: "12:00 PM - 02:00 PM", period: "Afternoon" },
  { id: "s5", time: "02:00 PM - 04:00 PM", period: "Afternoon" },
  { id: "s6", time: "04:00 PM - 06:00 PM", period: "Evening" },
  { id: "s7", time: "06:00 PM - 08:00 PM", period: "Prime Night" },
  { id: "s8", time: "08:00 PM - 10:00 PM", period: "Prime Night" },
];

// Mock booked slots to simulate real schedule
const MOCK_BOOKED_SLOTS: Record<string, string[]> = {};
getNext7Days().forEach((day) => {
  MOCK_BOOKED_SLOTS[day.rawDate] = [
    TIME_SLOTS[Math.floor(Math.random() * 3)].id,
    TIME_SLOTS[Math.floor(Math.random() * 3) + 4].id,
  ];
});

const TurfBook = () => {
  // Master selection state
  const [activeTurf, setActiveTurf] = useState<TurfItem | null>(null);
  const [showAuthRequired, setShowAuthRequired] = useState(false);

  // Listing filters states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("All");

  // Booking step states
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingSlot, setBookingSlot] = useState<{ id: string; time: string } | null>(null);

  // Player Form state
  const [playerDetails, setPlayerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [bookingReference, setBookingReference] = useState<string>("");

  const daysList = getNext7Days();

  // Reset booking values when returning to catalog list or changing venue
  const handleResetBooking = () => {
    setBookingStep(1);
    setBookingDate("");
    setBookingSlot(null);
    setPlayerDetails({ name: "", email: "", phone: "" });
    setBookingReference("");
  };

  const handleSelectTurf = (turf: TurfItem) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setShowAuthRequired(true);
    } else {
      setActiveTurf(turf);
      handleResetBooking();
      const savedEmail = localStorage.getItem("userEmail") || "";
      const savedName = localStorage.getItem("userName") || "";
      setPlayerDetails({
        name: savedName,
        email: savedEmail,
        phone: "",
      });
    }
  };

  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerDetails.name && playerDetails.email && playerDetails.phone) {
      setBookingStep(3);
    }
  };

  const handleCheckoutSubmit = () => {
    const ref = "THB-" + Math.floor(100000 + Math.random() * 900000);
    setBookingReference(ref);
    setBookingStep(4);
  };

  // Filter Catalog Data
  const filteredTurfs = turfCatalogData.filter((turf) => {
    const matchName = turf.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLoc = turf.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSport = selectedSport === "All" || turf.sport === selectedSport;
    return (matchName || matchLoc) && matchSport;
  });

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Header */}
        <div className="text-center mb-12">
          <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            Booking Dashboard
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Book Your Turf
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
        </div>

        <AnimatePresence mode="wait">
          {!activeTurf ? (
            /* VIEW 1: Venues Grid Catalog Selection */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Search & Category Filter Section */}
              <div className="mb-10 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4 items-center justify-between">
                
                {/* Search field */}
                <div className="relative w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="Search by venue name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <FaSearch />
                  </div>
                </div>

                {/* Sport selector buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {["All", "Cricket", "Football", "Tennis", "Basketball", "Badminton"].map((sport) => (
                    <button
                      key={sport}
                      onClick={() => setSelectedSport(sport)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSport === sport
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selection cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredTurfs.map((turf) => (
                  <Tilt key={turf.id} className="h-full">
                    <div className="group h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-green-500/30 dark:hover:border-green-500/30 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 flex flex-col justify-between">
                      
                      {/* Image panel */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={turf.image}
                          alt={turf.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-750"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400 font-bold px-3 py-1 rounded-full text-xs">
                          ${turf.pricePerHour}/hr
                        </div>
                        <div className="absolute top-4 left-4 bg-slate-950/80 text-white border border-slate-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {turf.sport}
                        </div>
                      </div>

                      {/* Info Details */}
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-805 dark:text-white mb-2 line-clamp-1">
                            {turf.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-4">
                            <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
                            <span className="line-clamp-1">{turf.location}</span>
                          </div>
                        </div>

                        {/* Booking triggering action */}
                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                          <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-lg text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                            <FaStar className="fill-current" />
                            <span>{turf.rating.toFixed(1)}</span>
                          </div>
                          
                          <button
                            onClick={() => handleSelectTurf(turf)}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 px-4.5 rounded-xl shadow-md transition cursor-pointer"
                          >
                            Select & Book
                          </button>
                        </div>
                      </div>

                    </div>
                  </Tilt>
                ))}
              </div>

              {filteredTurfs.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  <p className="text-slate-450 dark:text-slate-500 font-semibold mb-2">No turf matches your query filters.</p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSport("All");
                    }}
                    className="text-green-500 font-bold hover:underline"
                  >
                    Reset List
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* VIEW 2: Selected Turf Split Screen Booking Flow */
            <motion.div
              key="split-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back to list trigger button */}
              <button
                onClick={() => setActiveTurf(null)}
                className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-green-500 dark:text-slate-400 dark:hover:text-green-400 transition cursor-pointer"
              >
                <FaArrowLeft className="text-xs" />
                <span>Change Venue / Return to Catalog</span>
              </button>

              {/* Split Screen Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Panel: Specifications */}
                <div className="lg:col-span-5 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
                  {/* Photo Preview */}
                  <div className="relative h-64 w-full overflow-hidden rounded-2xl mb-6 border border-slate-100 dark:border-slate-850">
                    <img
                      src={activeTurf.image}
                      alt={activeTurf.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400 font-extrabold px-3.5 py-1.5 rounded-full text-sm">
                      ${activeTurf.pricePerHour}/hr
                    </div>
                    <div className="absolute top-4 left-4 bg-slate-950/80 text-white border border-slate-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      {activeTurf.sport}
                    </div>
                  </div>

                  <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                    {activeTurf.name}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-4">
                    <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
                    <span>{activeTurf.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-xl text-yellow-600 dark:text-yellow-400 text-sm font-bold w-fit mb-6">
                    <FaStar className="fill-current" />
                    <span>{activeTurf.rating.toFixed(1)} Ratings</span>
                  </div>

                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">
                    Venue Overview
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    This verified premium turf venue features international standard multi-sport turf grass, professional-grade lighting arrays, high border nets, and excellent field rebound properties. Suitable for friendly club match events and corporate tournament operations.
                  </p>

                  <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">
                    Included Amenities
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {activeTurf.amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 px-3 py-2.5 rounded-xl text-xs text-slate-600 dark:text-slate-400"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="font-semibold">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel: Inline Booking Card Wizard */}
                <div className="lg:col-span-7 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[580px]">
                  
                  {/* Progress Header */}
                  <div className="p-6 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white">
                        Reservation Progress
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1">
                        Step {bookingStep} of 4 • {bookingStep === 1 ? "Slot Picker" : bookingStep === 2 ? "Player Details" : bookingStep === 3 ? "Payment Review" : "Ticket Confirmation"}
                      </p>
                    </div>
                    
                    {/* Bubbles */}
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                            bookingStep === step
                              ? "bg-green-500 scale-110"
                              : bookingStep > step
                              ? "bg-emerald-600/80"
                              : "bg-slate-200 dark:bg-slate-800"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Step Panels */}
                  <div className="p-6 flex-grow">
                    <AnimatePresence mode="wait">
                      
                      {/* Step 1: Slots picker */}
                      {bookingStep === 1 && (
                        <motion.div
                          key="wizard-step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          {/* Days grid */}
                          <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                              1. Select Date
                            </label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                              {daysList.map((day) => (
                                <button
                                  key={day.rawDate}
                                  onClick={() => {
                                    setBookingDate(day.rawDate);
                                    setBookingSlot(null);
                                  }}
                                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition cursor-pointer ${
                                    bookingDate === day.rawDate
                                      ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/10"
                                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-105"
                                  }`}
                                >
                                  <span className="text-[9px] font-bold uppercase tracking-wide opacity-80">
                                    {day.dayName}
                                  </span>
                                  <span className="text-2xl font-black my-0.5">
                                    {day.dayNum}
                                  </span>
                                  <span className={`text-[8px] font-bold uppercase tracking-wider opacity-90 transition-colors ${
                                    bookingDate === day.rawDate
                                      ? "text-green-100"
                                      : "text-green-600 dark:text-green-400"
                                  }`}>
                                    {day.monthName} {day.year}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Time grid */}
                          {bookingDate && (
                            <div>
                              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                                2. Choose Available Time Slot
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {TIME_SLOTS.map((slot) => {
                                  const isBooked = MOCK_BOOKED_SLOTS[bookingDate]?.includes(slot.id);
                                  const isSelected = bookingSlot?.id === slot.id;

                                  return (
                                    <button
                                      key={slot.id}
                                      disabled={isBooked}
                                      onClick={() => setBookingSlot({ id: slot.id, time: slot.time })}
                                      className={`flex flex-col items-start p-4 rounded-xl border text-left transition cursor-pointer ${
                                        isBooked
                                          ? "bg-slate-100 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-900 text-slate-300 dark:text-slate-750 cursor-not-allowed"
                                          : isSelected
                                          ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/10"
                                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                      }`}
                                    >
                                      <span className={`text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full mb-2 ${
                                        isBooked
                                          ? "bg-slate-250 dark:bg-slate-900 text-slate-400 dark:text-slate-600"
                                          : isSelected
                                          ? "bg-white/20 text-white"
                                          : "bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                                      }`}>
                                        {isBooked ? "Booked" : slot.period}
                                      </span>
                                      <span className="text-sm font-bold">{slot.time}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {bookingSlot && (
                            <div className="bg-green-500/5 dark:bg-green-500/5 border border-green-500/10 dark:border-green-500/20 p-4 rounded-2xl flex items-center justify-between text-sm animate-in fade-in slide-in-from-bottom-2 duration-305 mt-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-700 dark:text-slate-355 text-xs uppercase tracking-wider mb-0.5">Booking Amount</span>
                                <span className="text-slate-400 dark:text-slate-500 text-[10px]">2 Hours Slot at ${activeTurf.pricePerHour}/hr</span>
                              </div>
                              <span className="text-green-600 dark:text-green-400 font-black text-xl">
                                ${activeTurf.pricePerHour * 2}.00
                              </span>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Step 2: User details form */}
                      {bookingStep === 2 && (
                        <motion.div
                          key="wizard-step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <form onSubmit={handlePlayerSubmit} className="space-y-5">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                              Enter Player Information
                            </h4>

                            {/* Full Name */}
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Full Name
                              </label>
                              <div className="relative">
                                <input
                                  required
                                  type="text"
                                  placeholder="Enter player name"
                                  value={playerDetails.name}
                                  onChange={(e) => setPlayerDetails({ ...playerDetails, name: e.target.value })}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3.5 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                                />
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                  <FaUser />
                                </div>
                              </div>
                            </div>

                            {/* Email */}
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Email Address
                              </label>
                              <div className="relative">
                                <input
                                  required
                                  type="email"
                                  placeholder="name@email.com"
                                  value={playerDetails.email}
                                  onChange={(e) => setPlayerDetails({ ...playerDetails, email: e.target.value })}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3.5 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                                />
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                  <FaEnvelope />
                                </div>
                              </div>
                            </div>

                            {/* Phone */}
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Phone Number
                              </label>
                              <div className="relative">
                                <input
                                  required
                                  type="tel"
                                  placeholder="10-digit number"
                                  pattern="[0-9]{10}"
                                  value={playerDetails.phone}
                                  onChange={(e) => setPlayerDetails({ ...playerDetails, phone: e.target.value })}
                                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3.5 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                                />
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                  <FaPhone />
                                </div>
                              </div>
                            </div>

                            <button type="submit" id="submitFormButton" className="hidden" />
                          </form>
                        </motion.div>
                      )}

                      {/* Step 3: Checkout payment */}
                      {bookingStep === 3 && (
                        <motion.div
                          key="wizard-step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
                            Review & Confirm Payment
                          </h4>

                          {/* Invoice review card */}
                          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl space-y-3.5 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400 dark:text-slate-500 font-semibold">Turf Venue:</span>
                              <span className="font-extrabold text-slate-800 dark:text-white">{activeTurf.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 dark:text-slate-500 font-semibold">Date booked:</span>
                              <span className="font-extrabold text-slate-800 dark:text-white">{formatDateFriendly(bookingDate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 dark:text-slate-500 font-semibold">Time Slot:</span>
                              <span className="font-extrabold text-slate-800 dark:text-white">{bookingSlot?.time}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 dark:text-slate-500 font-semibold">Player name:</span>
                              <span className="font-extrabold text-slate-800 dark:text-white">{playerDetails.name}</span>
                            </div>
                            
                            <hr className="border-slate-200/60 dark:border-slate-800" />
                            
                            <div className="flex justify-between">
                              <span className="text-slate-400 dark:text-slate-500 font-semibold">Hourly Rate:</span>
                              <span className="font-bold text-slate-800 dark:text-white">${activeTurf.pricePerHour}.00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 dark:text-slate-500 font-semibold">Hours:</span>
                              <span className="font-bold text-slate-800 dark:text-white">2 hrs</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400 dark:text-slate-500 font-semibold">Convenience Fee:</span>
                              <span className="font-bold text-slate-800 dark:text-white">$3.50</span>
                            </div>
                            
                            <hr className="border-slate-200/60 dark:border-slate-800" />
                            
                            <div className="flex justify-between text-base font-black">
                              <span className="text-slate-800 dark:text-white">Total Amount:</span>
                              <span className="text-green-600 dark:text-green-400">${activeTurf.pricePerHour * 2 + 3.50}</span>
                            </div>
                          </div>

                          {/* Payment select */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                              Select Payment Method
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                              {["UPI", "Credit Card", "Net Banking"].map((method) => (
                                <button
                                  key={method}
                                  onClick={() => setPaymentMethod(method)}
                                  className={`py-3 px-4 rounded-xl border font-bold text-xs transition cursor-pointer text-center ${
                                    paymentMethod === method
                                      ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/10"
                                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                  }`}
                                >
                                  {method}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 4: Digital ticket */}
                      {bookingStep === 4 && (
                        <motion.div
                          key="wizard-step4"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center text-center py-4"
                        >
                          <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center text-2xl mb-4">
                            <FaCheckCircle className="animate-bounce" />
                          </div>

                          <h4 className="text-2xl font-black text-slate-800 dark:text-white">
                            Reservation Successful!
                          </h4>
                          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1 max-w-xs">
                            Receipt has been finalized. Save details for venue check-in.
                          </p>

                          {/* Ticket detail coupon block */}
                          <div className="w-full mt-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-md">
                            
                            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-900 -translate-y-1/2" />
                            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-900 -translate-y-1/2" />

                            <div className="space-y-3.5 text-left text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold uppercase tracking-wider">Booking Reference</span>
                                <span className="font-extrabold text-slate-800 dark:text-white">{bookingReference}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold uppercase tracking-wider">Pitch Venue</span>
                                <span className="font-extrabold text-slate-800 dark:text-white line-clamp-1">{activeTurf.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold uppercase tracking-wider">Date</span>
                                <span className="font-extrabold text-slate-800 dark:text-white">{formatDateFriendly(bookingDate)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold uppercase tracking-wider">Time Slot</span>
                                <span className="font-extrabold text-slate-800 dark:text-white">{bookingSlot?.time}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold uppercase tracking-wider">Player Name</span>
                                <span className="font-extrabold text-slate-800 dark:text-white">{playerDetails.name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold uppercase tracking-wider">Amount Paid</span>
                                <span className="font-extrabold text-green-600 dark:text-green-400">${activeTurf.pricePerHour * 2 + 3.50}</span>
                              </div>
                            </div>

                            <div className="my-5 border-t-2 border-dashed border-slate-200 dark:border-slate-800" />

                            {/* QR Code SVG */}
                            <div className="flex flex-col items-center">
                              <div className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-sm mb-2.5">
                                <svg className="w-20 h-20 text-slate-850" viewBox="0 0 100 100">
                                  <rect x="10" y="10" width="25" height="25" stroke="currentColor" strokeWidth="5" fill="none" />
                                  <rect x="15" y="15" width="15" height="15" fill="currentColor" />
                                  <rect x="65" y="10" width="25" height="25" stroke="currentColor" strokeWidth="5" fill="none" />
                                  <rect x="70" y="15" width="15" height="15" fill="currentColor" />
                                  <rect x="10" y="65" width="25" height="25" stroke="currentColor" strokeWidth="5" fill="none" />
                                  <rect x="15" y="70" width="15" height="15" fill="currentColor" />
                                  
                                  <rect x="45" y="15" width="10" height="10" fill="currentColor" />
                                  <rect x="40" y="30" width="15" height="10" fill="currentColor" />
                                  <rect x="15" y="45" width="15" height="10" fill="currentColor" />
                                  <rect x="45" y="45" width="20" height="20" fill="currentColor" />
                                  <rect x="75" y="45" width="15" height="15" fill="currentColor" />
                                  <rect x="45" y="75" width="15" height="15" fill="currentColor" />
                                  <rect x="70" y="70" width="10" height="15" fill="currentColor" />
                                </svg>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Scan to check-in
                              </span>
                            </div>

                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>

                  {/* Actions buttons control at the bottom */}
                  <div className="p-6 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 flex gap-4">
                    {bookingStep === 1 && (
                      <button
                        disabled={!bookingDate || !bookingSlot}
                        onClick={() => setBookingStep(2)}
                        className={`w-full py-3.5 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer ${
                          !bookingDate || !bookingSlot
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-650 shadow-none cursor-not-allowed"
                            : "bg-green-500 text-white shadow-green-500/10 hover:bg-green-600"
                        }`}
                      >
                        <span>Continue to Details</span>
                        <FaArrowRight className="text-xs" />
                      </button>
                    )}

                    {bookingStep === 2 && (
                      <>
                        <button
                          onClick={() => setBookingStep(1)}
                          className="w-1/3 py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                        >
                          <FaArrowLeft className="text-xs" />
                          <span>Back</span>
                        </button>
                        <button
                          onClick={() => {
                            const submitBtn = document.getElementById("submitFormButton");
                            if (submitBtn) submitBtn.click();
                          }}
                          className="w-2/3 py-3.5 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition flex items-center justify-center gap-2 text-sm shadow-md shadow-green-500/10 cursor-pointer"
                        >
                          <span>Proceed to Payment</span>
                          <FaArrowRight className="text-xs" />
                        </button>
                      </>
                    )}

                    {bookingStep === 3 && (
                      <>
                        <button
                          onClick={() => setBookingStep(2)}
                          className="w-1/3 py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                        >
                          <FaArrowLeft className="text-xs" />
                          <span>Back</span>
                        </button>
                        <button
                          onClick={handleCheckoutSubmit}
                          className="w-2/3 py-3.5 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition flex items-center justify-center gap-2 text-sm shadow-md shadow-green-500/15 cursor-pointer"
                        >
                          <span>Pay & Confirm Booking</span>
                          <FaCheckCircle className="text-xs" />
                        </button>
                      </>
                    )}

                    {bookingStep === 4 && (
                      <div className="w-full flex gap-3">
                        <button
                          onClick={() => alert("Digital ticket PDF downloaded! (Mock)")}
                          className="w-1/2 py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-sm cursor-pointer"
                        >
                          <FaDownload />
                          <span>Download Ticket</span>
                        </button>
                        <button
                          onClick={handleResetBooking}
                          className="w-1/2 py-3.5 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition text-sm shadow-md shadow-green-500/10 cursor-pointer"
                        >
                          Book Another Slot
                        </button>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Auth Required Popup */}
        <AnimatePresence>
          {showAuthRequired && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAuthRequired(false)}
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs pointer-events-auto"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-8 rounded-3xl shadow-2xl z-10 pointer-events-auto text-center"
              >
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-6">
                  <FaUser />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">
                  Login Required
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">
                  You must be logged in to book a sports turf slot. Click below to sign in or create an account.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAuthRequired(false)}
                    className="w-1/2 py-3 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-105 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Link
                    to="/login"
                    className="w-1/2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xs shadow-md shadow-green-500/10 block text-center"
                  >
                    Login Now
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default TurfBook;