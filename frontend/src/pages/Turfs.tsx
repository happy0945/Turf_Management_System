import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaStar,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaDownload,
  FaArrowLeft,
  FaArrowRight,
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

const Turfs = () => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [sortOption, setSortOption] = useState<string>("Featured");
  const [showAuthRequired, setShowAuthRequired] = useState(false);

  // Booking Wizard States
  const [bookingTurf, setBookingTurf] = useState<TurfItem | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingSlot, setBookingSlot] = useState<{ id: string; time: string } | null>(null);

  // Player Details States
  const [playerDetails, setPlayerDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Checkout Payment States
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI");
  const [bookingReference, setBookingReference] = useState<string>("");

  const daysList = getNext7Days();

  // Reset booking wizard state
  const closeBooking = () => {
    setBookingTurf(null);
    setBookingStep(1);
    setBookingDate("");
    setBookingSlot(null);
    setPlayerDetails({ name: "", email: "", phone: "" });
    setBookingReference("");
  };

  // Handle Form Submission / Next step triggers
  const handleSlotSelection = () => {
    if (bookingDate && bookingSlot) {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setShowAuthRequired(true);
      } else {
        setBookingStep(2);
        // Pre-populate user details from storage if present
        const savedEmail = localStorage.getItem("userEmail") || "";
        const savedName = localStorage.getItem("userName") || "";
        setPlayerDetails({
          name: savedName,
          email: savedEmail,
          phone: "",
        });
      }
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

  // Filter & Sort Logic
  const filteredTurfs = turfCatalogData
    .filter((turf) => {
      const matchName = turf.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLoc = turf.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSport = selectedSport === "All" || turf.sport === selectedSport;
      return (matchName || matchLoc) && matchSport;
    })
    .sort((a, b) => {
      if (sortOption === "PriceLowHigh") return a.pricePerHour - b.pricePerHour;
      if (sortOption === "PriceHighLow") return b.pricePerHour - a.pricePerHour;
      if (sortOption === "RatingHighLow") return b.rating - a.rating;
      return 0; // Default sorting
    });

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* VIEW 1: Catalog Listings */}
        {!bookingTurf ? (
          <>
            {/* Title Header */}
            <div className="text-center mb-12">
              <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                Booking catalog
              </span>
              <h1 className="text-4xl md:text-6xl font-black mt-3">
                Reserve Your Pitch
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
            </div>

            {/* Filter Panel Layout */}
            <div className="mb-10 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Text Search input */}
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 py-3 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition-all"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <FaSearch />
                </div>
              </div>

              {/* Sport Filters */}
              <div className="flex flex-wrap gap-2 justify-center">
                {["All", "Cricket", "Football", "Tennis", "Basketball", "Badminton"].map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport)}
                    className={`py-2.5 px-5 rounded-xl text-xs font-bold tracking-wide transition cursor-pointer ${
                      selectedSport === sport
                        ? "bg-green-500 text-white shadow-md shadow-green-500/10 border border-green-500"
                        : "bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    {sport}
                  </button>
                ))}
              </div>

              {/* Sort Selection */}
              <div className="w-full md:w-auto">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition cursor-pointer"
                >
                  <option value="Featured">Sort: Featured</option>
                  <option value="PriceLowHigh">Price: Low to High</option>
                  <option value="PriceHighLow">Price: High to Low</option>
                  <option value="RatingHighLow">Rating: Highest First</option>
                </select>
              </div>
            </div>

            {/* Turf Catalog Grid (Enlarged 3 columns format) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTurfs.map((turf) => (
                <Tilt key={turf.id} className="h-full">
                  <div
                    onClick={() => {
                      setBookingTurf(turf);
                      setBookingStep(1);
                    }}
                    className="group h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-green-500/40 dark:hover:border-green-500/40 rounded-3xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.02)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(34,197,94,0.08)] transition-all duration-500 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1.5"
                  >
                    {/* Image panel */}
                    <div className="relative h-64 w-full overflow-hidden">
                      <img
                        src={turf.image}
                        alt={turf.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400 font-extrabold px-4 py-1.5 rounded-full text-xs">
                        ${turf.pricePerHour}/hr
                      </div>
                      <div className="absolute top-4 left-4 bg-slate-950/80 text-white border border-slate-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        {turf.sport}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-850 dark:text-white mb-2 line-clamp-1 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300">
                          {turf.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-4">
                          <FaMapMarkerAlt className="text-green-500" />
                          <span className="line-clamp-1">{turf.location}</span>
                        </div>

                        {/* Amenities list */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {turf.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full">
                              {amenity}
                            </span>
                          ))}
                          {turf.amenities.length > 3 && (
                            <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-2.5 py-1 rounded-full">
                              +{turf.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions footer */}
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5 mt-auto">
                        <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-lg text-yellow-600 dark:text-yellow-400 text-xs font-bold">
                          <FaStar className="fill-current" />
                          <span>{turf.rating.toFixed(1)} Ratings</span>
                        </div>
                        
                        <span className="text-green-500 dark:text-green-400 text-xs font-black group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-1">
                          <span>View details & book</span>
                          <FaArrowRight className="text-[10px]" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Tilt>
              ))}
            </div>

            {/* Empty Catalog State */}
            {filteredTurfs.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-400 dark:text-slate-500 font-semibold mb-2">No venues match your criteria.</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSport("All");
                    setSortOption("Featured");
                  }}
                  className="text-green-500 font-bold hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        ) : (
          /* VIEW 2: Full-page detailed view with inline booking options at bottom */
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Back to list trigger button */}
            <button
              onClick={closeBooking}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-green-500 dark:text-slate-400 dark:hover:text-green-400 transition cursor-pointer"
            >
              <FaArrowLeft className="text-xs" />
              <span>Back to Turf Listings</span>
            </button>

            {/* 1. Large Details panel */}
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
              {/* Photo Preview */}
              <div className="relative h-96 w-full overflow-hidden rounded-2xl mb-6 border border-slate-100 dark:border-slate-800">
                <img
                  src={bookingTurf.image}
                  alt={bookingTurf.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400 font-extrabold px-4 py-2 rounded-full text-sm">
                  ${bookingTurf.pricePerHour}/hr
                </div>
                <div className="absolute top-4 left-4 bg-slate-950/80 text-white border border-slate-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                  {bookingTurf.sport}
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-850 dark:text-white mb-2">
                    {bookingTurf.name}
                  </h2>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                    <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
                    <span>{bookingTurf.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl text-yellow-600 dark:text-yellow-400 text-sm font-bold w-fit h-fit">
                  <FaStar className="fill-current" />
                  <span>{bookingTurf.rating.toFixed(1)} Rating Metrics</span>
                </div>
              </div>

              <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">
                Venue Overview
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                This verified premium turf venue features international standard multi-sport turf grass, professional-grade lighting arrays, high border nets, and excellent field rebound properties. Suitable for friendly club match events and corporate tournament operations. Included lockers, clean change rooms, and safe onsite parking spaces make it perfect for weekend sports meets.
              </p>

              <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-3">
                Included Amenities
              </h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {bookingTurf.amenities.map((amenity, i) => (
                  <span key={i} className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Separator to Booking Section */}
            <div className="text-center py-6">
              <div className="w-16 h-1 bg-green-500 rounded-full mx-auto" />
            </div>

            {/* 2. Wizard Inline Booking Options Card (Shown at the last) */}
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
              
              {/* Progress Indicator */}
              <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-850 pb-4 mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-850 dark:text-white">
                    {bookingStep === 4 ? "Booking Completed" : "Secure Reservation Form"}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {bookingStep === 1 && "Step 1 of 4 • Select Date & Time"}
                    {bookingStep === 2 && "Step 2 of 4 • Enter details"}
                    {bookingStep === 3 && "Step 3 of 4 • Payment & Checkout"}
                    {bookingStep === 4 && "Step 4 of 4 • Success receipt"}
                  </span>
                </div>

                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        bookingStep === step
                          ? "bg-green-500 scale-110 shadow-sm"
                          : bookingStep > step
                          ? "bg-emerald-650"
                          : "bg-slate-200 dark:bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step Panels */}
              <div className="py-2">
                {/* STEP 1: Date & Time Picker */}
                {bookingStep === 1 && (
                  <div className="space-y-6">
                    {/* Date select */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        1. Select Date
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
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
                                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wide opacity-80">
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

                    {/* Time Picker */}
                    {bookingDate && (
                      <div className="animate-in fade-in duration-300">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                          2. Choose Available Time Slot
                        </label>
                        <div className="grid grid-cols-2 gap-3">
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
                                    ? "bg-slate-100 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-900 text-slate-300 dark:text-slate-700 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/10"
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                                }`}
                              >
                                <span className={`text-[9px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded-full mb-2 ${
                                  isBooked
                                    ? "bg-slate-200 dark:bg-slate-900 text-slate-400 dark:text-slate-600"
                                    : isSelected
                                    ? "bg-white/20 text-white"
                                    : "bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                                }`}>
                                  {isBooked ? "Booked" : slot.period}
                                </span>
                                <span className="text-sm font-extrabold">{slot.time}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Pricing summary */}
                    {bookingSlot && (
                      <div className="bg-green-500/5 dark:bg-green-500/5 border border-green-500/10 dark:border-green-500/20 p-4 rounded-2xl flex items-center justify-between text-sm animate-in fade-in slide-in-from-bottom-2 duration-305 mt-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 dark:text-slate-350 text-xs uppercase tracking-wider mb-0.5">Booking Amount</span>
                          <span className="text-slate-400 dark:text-slate-500 text-[10px]">2 Hours Slot at ${bookingTurf.pricePerHour}/hr</span>
                        </div>
                        <span className="text-green-600 dark:text-green-400 font-black text-xl">
                          ${bookingTurf.pricePerHour * 2}.00
                        </span>
                      </div>
                    )}

                    {/* Step Actions */}
                    <button
                      disabled={!bookingDate || !bookingSlot}
                      onClick={handleSlotSelection}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold transition duration-300 text-center text-sm shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                        !bookingDate || !bookingSlot
                          ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                          : "bg-green-500 text-white hover:bg-green-600 shadow-green-500/10"
                      }`}
                    >
                      <span>Continue to Details</span>
                      <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                )}

                {/* STEP 2: Player details form */}
                {bookingStep === 2 && (
                  <form onSubmit={handlePlayerSubmit} className="space-y-5 animate-in fade-in duration-305">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">
                      Enter Booking Information
                    </h4>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          required
                          type="text"
                          placeholder="Enter your name"
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
                        Contact Number
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

                    {/* Actions button */}
                    <div className="flex gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className="w-1/3 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold transition text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-3.5 rounded-xl bg-green-500 text-white font-bold transition text-sm hover:bg-green-600 shadow-md shadow-green-500/10 cursor-pointer"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: Summary & Secure Checkout */}
                {bookingStep === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-305">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">
                      Review Booking & Checkout
                    </h4>

                    {/* Summary list */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl space-y-3.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400 dark:text-slate-500 font-semibold">Turf Venue:</span>
                        <span className="font-extrabold text-slate-800 dark:text-white">{bookingTurf.name}</span>
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
                        <span className="font-bold text-slate-800 dark:text-white">${bookingTurf.pricePerHour}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 dark:text-slate-500 font-semibold">Hours included:</span>
                        <span className="font-bold text-slate-800 dark:text-white">2 hrs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 dark:text-slate-500 font-semibold">Service Fee:</span>
                        <span className="font-bold text-slate-800 dark:text-white">$3.50</span>
                      </div>
                      
                      <hr className="border-slate-200/60 dark:border-slate-800" />
                      
                      <div className="flex justify-between text-base font-black">
                        <span className="text-slate-800 dark:text-white">Total Amount:</span>
                        <span className="text-green-600 dark:text-green-400">${bookingTurf.pricePerHour * 2 + 3.50}</span>
                      </div>
                    </div>

                    {/* Payment choices */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Choose Mock Payment Method
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

                    {/* Actions button */}
                    <div className="flex gap-4 pt-2">
                      <button
                        onClick={() => setBookingStep(2)}
                        className="w-1/3 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold transition text-sm cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCheckoutSubmit}
                        className="w-2/3 py-3.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition shadow-md shadow-green-500/15 text-sm cursor-pointer text-center"
                      >
                        Confirm & Pay
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 4: Receipt voucher */}
                {bookingStep === 4 && (
                  <div className="flex flex-col items-center text-center py-4 animate-in fade-in duration-305">
                    <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center text-2xl mb-4">
                      <FaCheckCircle className="animate-bounce" />
                    </div>

                    <h4 className="text-2xl font-black text-slate-800 dark:text-white">
                      Reservation Successful!
                    </h4>
                    <p className="text-slate-400 dark:text-slate-550 text-xs mt-1 max-w-xs">
                      Receipt has been finalized. Save details for venue check-in.
                    </p>

                    {/* Voucher Card */}
                    <div className="w-full mt-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-md">
                      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-900 -translate-y-1/2" />
                      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-900 -translate-y-1/2" />

                      <div className="space-y-4 text-left text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Booking ID</span>
                          <span className="font-extrabold text-slate-800 dark:text-white text-sm">{bookingReference}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Venue</span>
                          <span className="font-extrabold text-slate-800 dark:text-white line-clamp-1">{bookingTurf.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Date</span>
                          <span className="font-extrabold text-slate-800 dark:text-white">{formatDateFriendly(bookingDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Time Slot</span>
                          <span className="font-extrabold text-slate-800 dark:text-white">{bookingSlot?.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider">Player</span>
                          <span className="font-extrabold text-slate-800 dark:text-white">{playerDetails.name}</span>
                        </div>
                      </div>

                      {/* Dashed line */}
                      <div className="my-5 border-t-2 border-dashed border-slate-200 dark:border-slate-800" />

                      {/* Mock QR */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm mb-2">
                          <svg className="w-24 h-24 text-slate-800" viewBox="0 0 100 100">
                            <rect x="10" y="10" width="25" height="25" stroke="currentColor" strokeWidth="5" fill="none" />
                            <rect x="15" y="15" width="15" height="15" fill="currentColor" />
                            <rect x="65" y="10" width="25" height="25" stroke="currentColor" strokeWidth="5" fill="none" />
                            <rect x="70" y="15" width="15" height="15" fill="currentColor" />
                            <rect x="10" y="65" width="25" height="25" stroke="currentColor" strokeWidth="5" fill="none" />
                            <rect x="15" y="70" width="15" height="15" fill="currentColor" />
                            <rect x="45" y="10" width="10" height="10" fill="currentColor" />
                            <rect x="45" y="30" width="10" height="10" fill="currentColor" />
                            <rect x="35" y="45" width="10" height="10" fill="currentColor" />
                            <rect x="55" y="45" width="10" height="10" fill="currentColor" />
                            <rect x="45" y="65" width="10" height="10" fill="currentColor" />
                            <rect x="45" y="75" width="15" height="15" fill="currentColor" />
                            <rect x="70" y="70" width="10" height="15" fill="currentColor" />
                          </svg>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          Scan to verify
                        </span>
                      </div>
                    </div>

                    {/* Actions button */}
                    <div className="w-full flex gap-3 mt-6">
                      <button
                        onClick={() => {
                          alert("Digital receipt ticket downloaded! (Mock)");
                        }}
                        className="w-1/2 py-3.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-sm cursor-pointer text-center"
                      >
                        <FaDownload />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={closeBooking}
                        className="w-1/2 py-3.5 px-4 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition shadow-md shadow-green-500/10 text-sm cursor-pointer text-center"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Auth Prompt Modal */}
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
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl z-10 pointer-events-auto text-center"
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
                  className="w-1/2 py-3 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
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
  );
};

export default Turfs;