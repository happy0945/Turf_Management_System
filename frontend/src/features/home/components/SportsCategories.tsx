import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Tilt from "./Tilt";
import type { TurfItem } from "../data/turfCatalogData";

const CATEGORIES = [
  {
    name: "Cricket",
    color: "green",
    iconColor: "text-green-500",
    borderActive: "border-green-500",
    bgActive: "bg-green-500/10",
    badgeColor: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6 12h12" />
        <path d="M12 6v12" />
        <path d="M8 8l8 8" />
        <path d="M16 8l-8 8" />
      </svg>
    ),
  },
  {
    name: "Football",
    color: "emerald",
    iconColor: "text-emerald-500",
    borderActive: "border-emerald-500",
    bgActive: "bg-emerald-500/10",
    badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    name: "Tennis",
    color: "yellow",
    iconColor: "text-yellow-500",
    borderActive: "border-yellow-500",
    bgActive: "bg-yellow-500/10",
    badgeColor: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
        <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    name: "Basketball",
    color: "orange",
    iconColor: "text-orange-500",
    borderActive: "border-orange-500",
    bgActive: "bg-orange-500/10",
    badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M6.2 6.2C9 3.4 15 3.4 17.8 6.2c2.8 2.8 2.8 8.8 0 11.6-2.8 2.8-8.8 2.8-11.6 0-2.8-2.8-2.8-8.8 0-11.6" />
        <path d="M2 12h20" />
        <path d="M12 2v20" />
      </svg>
    ),
  },
  {
    name: "Badminton",
    color: "cyan",
    iconColor: "text-cyan-500",
    borderActive: "border-cyan-500",
    bgActive: "bg-cyan-500/10",
    badgeColor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    icon: (
      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v10" />
        <path d="M8 6h8" />
        <path d="m12 12-4 8h8z" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const SportsCategories = () => {
  const navigate = useNavigate();

  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [filteredTurfs, setFilteredTurfs] = useState<TurfItem[]>([]);
  const [allTurfs, setAllTurfs] = useState<TurfItem[]>([]);

  // Load turfs from localStorage
  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("turfCatalogData");
      if (stored) {
        try { setAllTurfs(JSON.parse(stored)); } catch { setAllTurfs([]); }
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const handleCategoryClick = (sportName: string) => {
    if (selectedSport === sportName) {
      // Second click = deselect / hide results
      setSelectedSport(null);
      setFilteredTurfs([]);
      return;
    }
    setSelectedSport(sportName);
    const matches = allTurfs.filter(
      (t) => t.sport?.toLowerCase() === sportName.toLowerCase()
    );
    setFilteredTurfs(matches);
  };

  const activeCat = CATEGORIES.find((c) => c.name === selectedSport);

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-green-500 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Sports categories
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-4">
          Select Your Sport
        </h2>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">Click a category to browse available venues</p>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Category Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        {CATEGORIES.map((cat, idx) => {
          const isActive = selectedSport === cat.name;
          return (
            <motion.div key={idx} variants={cardVariants}>
              <Tilt className="h-full">
                <div
                  onClick={() => handleCategoryClick(cat.name)}
                  className={`group h-full cursor-pointer backdrop-blur-md p-8 rounded-2xl text-center flex flex-col items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
                    ${isActive
                      ? `bg-white dark:bg-slate-900/70 ${cat.borderActive} border-2 shadow-[0_15px_35px_rgba(34,197,94,0.12)]`
                      : "bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:border-green-500/30 hover:shadow-[0_15px_35px_rgba(34,197,94,0.08)]"
                    }`}
                >
                  <div className={`w-20 h-20 rounded-2xl border flex items-center justify-center mb-6 transition-all duration-300 shadow-sm dark:shadow-none
                    ${isActive
                      ? `${cat.bgActive} border-current ${cat.iconColor} scale-110`
                      : "bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 group-hover:scale-110"
                    } ${cat.iconColor}`}
                  >
                    {cat.icon}
                  </div>
                  <h3 className={`text-lg font-bold mb-1 transition-colors duration-300
                    ${isActive ? cat.iconColor : "text-slate-800 dark:text-white group-hover:text-green-500 dark:group-hover:text-green-400"}`}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                    {allTurfs.filter((t) => t.sport?.toLowerCase() === cat.name.toLowerCase()).length || "—"} Venues
                  </p>
                  {isActive && (
                    <span className={`mt-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                      Selected ✓
                    </span>
                  )}
                </div>
              </Tilt>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filtered Turf Results Section */}
      <AnimatePresence>
        {selectedSport && (
          <motion.div
            key={selectedSport}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="mt-14"
          >
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-3">
                  <span className={`${activeCat?.iconColor}`}>{activeCat?.icon && <span className="inline-block scale-75">{activeCat.icon}</span>}</span>
                  {selectedSport} Venues
                  <span className={`text-sm font-extrabold px-3 py-1 rounded-full border ${activeCat?.badgeColor}`}>
                    {filteredTurfs.length} found
                  </span>
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Click a card to book a slot</p>
              </div>
              <button
                onClick={() => { setSelectedSport(null); setFilteredTurfs([]); }}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                ✕ Clear Filter
              </button>
            </div>

            {filteredTurfs.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-400 font-semibold text-sm">No {selectedSport} venues available yet.</p>
                <p className="text-slate-300 dark:text-slate-600 text-xs mt-1">Check back later or browse all turfs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTurfs.map((turf, idx) => (
                  <motion.div
                    key={turf.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.4 }}
                  >
                    <Tilt className="h-full">
                      <div
                        onClick={() => navigate("/book-turf")}
                        className="group h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-green-500/40 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(34,197,94,0.08)] transition-all duration-300 flex flex-col cursor-pointer"
                      >
                        {/* Image */}
                        <div className="relative h-44 w-full overflow-hidden flex-shrink-0">
                          <img
                            src={turf.image}
                            alt={turf.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Price badge */}
                          <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400 font-extrabold px-3 py-1 rounded-full text-xs">
                            ${turf.pricePerHour}/hr
                          </div>
                          {/* Sport badge */}
                          <div className="absolute top-3 left-3 bg-slate-950/80 text-white border border-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            {turf.sport}
                          </div>
                          {/* Rating badge */}
                          <div className="absolute bottom-3 left-3 bg-slate-950/80 text-yellow-400 border border-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                            ★ {turf.rating?.toFixed(1) ?? "5.0"}
                          </div>
                        </div>
                        {/* Info */}
                        <div className="p-4 flex flex-col gap-2 flex-1">
                          <h4 className="font-black text-sm text-slate-800 dark:text-white truncate group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
                            {turf.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                            <span>📍</span> {turf.location}
                          </p>
                          {turf.amenities && turf.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {turf.amenities.slice(0, 2).map((a, i) => (
                                <span key={i} className="text-[9px] font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                                  {a}
                                </span>
                              ))}
                              {turf.amenities.length > 2 && (
                                <span className="text-[9px] font-semibold text-slate-400">+{turf.amenities.length - 2} more</span>
                              )}
                            </div>
                          )}
                          <button className="mt-auto w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl text-xs transition shadow-md shadow-green-500/10">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </Tilt>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SportsCategories;
