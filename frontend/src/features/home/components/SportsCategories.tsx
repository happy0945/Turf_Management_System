import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Tilt from "./Tilt";
import { turfService } from "../../../services/turfService";
import type { Turf } from "../../../services/turfService";
import { FaMapMarkerAlt, FaStar, FaRupeeSign, FaArrowRight, FaSpinner } from "react-icons/fa";

const CATEGORIES = [
  {
    name: "Cricket",
    iconColor: "text-green-500",
    borderActive: "border-green-500",
    bgActive: "bg-green-500/10",
    badgeColor: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M6 12h12" /><path d="M12 6v12" /><path d="M8 8l8 8" /><path d="M16 8l-8 8" />
      </svg>
    ),
  },
  {
    name: "Football",
    iconColor: "text-emerald-500",
    borderActive: "border-emerald-500",
    bgActive: "bg-emerald-500/10",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2v20" /><path d="M2 12h20" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    name: "Tennis",
    iconColor: "text-yellow-500",
    borderActive: "border-yellow-500",
    bgActive: "bg-yellow-500/10",
    badgeColor: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" /><path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" /><path d="M2 12h20" />
      </svg>
    ),
  },
  {
    name: "Basketball",
    iconColor: "text-orange-500",
    borderActive: "border-orange-500",
    bgActive: "bg-orange-500/10",
    badgeColor: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M6.2 6.2C9 3.4 15 3.4 17.8 6.2c2.8 2.8 2.8 8.8 0 11.6-2.8 2.8-8.8 2.8-11.6 0-2.8-2.8-2.8-8.8 0-11.6" /><path d="M2 12h20" /><path d="M12 2v20" />
      </svg>
    ),
  },
  {
    name: "Badminton",
    iconColor: "text-cyan-500",
    borderActive: "border-cyan-500",
    bgActive: "bg-cyan-500/10",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v10" /><path d="M8 6h8" /><path d="m12 12-4 8h8z" /><circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const SportsCategories = () => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [allTurfs, setAllTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    turfService.getAllTurfs()
      .then(setAllTurfs)
      .catch(() => setAllTurfs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCategoryClick = (sportName: string) => {
    setSelectedSport((prev) => (prev === sportName ? null : sportName));
  };

  const filteredTurfs = selectedSport
    ? allTurfs.filter((t) =>
        t.sportsType?.some((s) => s.toLowerCase() === selectedSport.toLowerCase())
      )
    : [];

  const activeCat = CATEGORIES.find((c) => c.name === selectedSport);

  const countForSport = (sport: string) =>
    allTurfs.filter((t) =>
      t.sportsType?.some((s) => s.toLowerCase() === sport.toLowerCase())
    ).length;

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Sports Categories
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-4">
          Select Your Sport
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Click a category to browse available venues
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Category Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
      >
        {CATEGORIES.map((cat, idx) => {
          const isActive = selectedSport === cat.name;
          const count = countForSport(cat.name);
          return (
            <motion.div key={idx} variants={cardVariants}>
              <Tilt className="h-full">
                <div
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`group h-full cursor-pointer backdrop-blur-md p-7 rounded-2xl text-center flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                    isActive
                      ? `bg-white dark:bg-slate-900/70 border-2 ${cat.borderActive} shadow-lg`
                      : "bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-green-500/30 shadow-sm dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:shadow-md"
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `${cat.bgActive} ${cat.iconColor} scale-105`
                      : `bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 ${cat.iconColor} group-hover:scale-105`
                  }`}>
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className={`text-base font-bold transition-colors duration-200 ${
                      isActive ? cat.iconColor : "text-slate-800 dark:text-white group-hover:text-green-500 dark:group-hover:text-green-400"
                    }`}>
                      {cat.name}
                    </h3>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5 font-medium">
                      {loading ? "…" : count > 0 ? `${count} venue${count > 1 ? "s" : ""}` : "No venues"}
                    </p>
                  </div>
                  {isActive && (
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                      Selected ✓
                    </span>
                  )}
                </div>
              </Tilt>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filtered Results Panel */}
      <AnimatePresence>
        {selectedSport && (
          <motion.div
            key={selectedSport}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-12"
          >
            {/* Results header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2 flex-wrap">
                  <span className={activeCat?.iconColor}>{activeCat?.name}</span> Venues
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${activeCat?.badgeColor}`}>
                    {filteredTurfs.length} found
                  </span>
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Click any card to view and book</p>
              </div>
              <button
                onClick={() => setSelectedSport(null)}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl transition cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5"
              >
                ✕ Clear
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-14">
                <FaSpinner className="animate-spin text-2xl text-green-500" />
              </div>
            ) : filteredTurfs.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-sm">
                  No {selectedSport} venues listed yet.
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
                  Be the first to add one — register as an owner!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredTurfs.map((turf, idx) => {
                  const imageUrl = turf.images?.[0]?.url || "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop";
                  return (
                    <motion.div
                      key={turf._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06, duration: 0.35 }}
                    >
                      <Link to={`/turf/${turf._id}`} className="group block h-full">
                        <div className="h-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-green-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                          {/* Image */}
                          <div className="relative h-40 overflow-hidden flex-shrink-0">
                            <img
                              src={imageUrl}
                              alt={turf.turfName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop"; }}
                            />
                            <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-slate-950/90 border border-slate-100 dark:border-slate-700 text-green-600 dark:text-green-400 font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-0.5">
                              <FaRupeeSign className="text-[9px]" />{turf.pricePerSlot}/slot
                            </div>
                            <div className="absolute bottom-2.5 left-2.5 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                              <FaStar className="text-[9px]" />{(turf.rating ?? 5).toFixed(1)}
                            </div>
                          </div>
                          {/* Info */}
                          <div className="p-4 flex flex-col gap-2 flex-grow">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-1">
                              {turf.turfName}
                            </h4>
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                              <FaMapMarkerAlt className="text-green-500 flex-shrink-0 text-[10px]" />
                              <span className="line-clamp-1">{turf.location?.city || turf.location?.address}</span>
                            </div>
                            {turf.amenities?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {turf.amenities.slice(0, 2).map((a, i) => (
                                  <span key={i} className="text-[9px] font-medium bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                                    {a}
                                  </span>
                                ))}
                                {turf.amenities.length > 2 && (
                                  <span className="text-[9px] text-slate-400">+{turf.amenities.length - 2}</span>
                                )}
                              </div>
                            )}
                            <span className="mt-auto flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 group-hover:gap-2 transition-all">
                              Book Now <FaArrowRight className="text-[9px]" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SportsCategories;
