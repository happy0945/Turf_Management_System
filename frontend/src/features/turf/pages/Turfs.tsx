import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt, FaStar, FaFutbol, FaSearch,
  FaChevronDown, FaSpinner, FaExclamationCircle
} from "react-icons/fa";
import { turfService, type Turf } from "../../../services/turfService";

const SPORTS_ICONS: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Basketball: "🏀",
  Badminton: "🏸",
};

const Turfs = () => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [filtered, setFiltered] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"rating" | "price_asc" | "price_desc">("rating");

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await turfService.getAllTurfs();
        setTurfs(data);
        setFiltered(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load turfs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, []);

  // Filter + sort whenever criteria change
  useEffect(() => {
    let result = [...turfs];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.turfName.toLowerCase().includes(q) ||
          t.location.city.toLowerCase().includes(q) ||
          t.location.address.toLowerCase().includes(q)
      );
    }

    // Sport filter
    if (selectedSport !== "All") {
      result = result.filter((t) => t.sportsType.includes(selectedSport));
    }

    // Sort
    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price_asc") {
      result.sort((a, b) => a.pricePerSlot - b.pricePerSlot);
    } else {
      result.sort((a, b) => b.pricePerSlot - a.pricePerSlot);
    }

    setFiltered(result);
  }, [search, selectedSport, sortBy, turfs]);

  const sports = ["All", "Cricket", "Football", "Basketball", "Badminton"];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white mb-3">
            Browse{" "}
            <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
              Turfs
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Find and book premium sports facilities near you
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by turf name, city or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500/40 transition text-sm"
            />
          </div>

          {/* Sport selector */}
          <div className="flex gap-2 flex-wrap">
            {sports.map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  selectedSport === sport
                    ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-green-500/40"
                }`}
              >
                {sport !== "All" && SPORTS_ICONS[sport]} {sport}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-4 py-3 pr-8 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500/40 cursor-pointer"
            >
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FaSpinner className="text-green-500 text-4xl animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-semibold">Loading turfs...</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FaExclamationCircle className="text-red-500 text-4xl" />
            <p className="text-red-500 font-semibold text-center">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <FaFutbol className="text-slate-300 dark:text-slate-700 text-5xl" />
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg text-center">
              {turfs.length === 0 ? "No turfs available yet. Check back soon!" : "No turfs match your search."}
            </p>
            {search || selectedSport !== "All" ? (
              <button
                onClick={() => { setSearch(""); setSelectedSport("All"); }}
                className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        )}

        {/* Turfs Grid */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">
              Showing <span className="text-green-500 font-bold">{filtered.length}</span> turf{filtered.length !== 1 ? "s" : ""}
            </p>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filtered.map((turf, idx) => (
                  <TurfCard key={turf._id} turf={turf} index={idx} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

const TurfCard = ({ turf, index }: { turf: Turf; index: number }) => {
  const coverImage = turf.images?.[0]?.url || `https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-green-500/30 hover:shadow-[0_8px_30px_rgba(34,197,94,0.1)] transition-all duration-300 cursor-pointer"
    >
      <Link to={`/turf/${turf._id}`}>
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={coverImage}
            alt={turf.turfName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Sports tags */}
          <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
            {turf.sportsType.slice(0, 3).map((s) => (
              <span key={s} className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {SPORTS_ICONS[s]} {s}
              </span>
            ))}
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-white font-bold text-xs">{turf.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-black text-slate-800 dark:text-white text-lg mb-1.5 group-hover:text-green-500 transition-colors">
            {turf.turfName}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm mb-3">
            <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
            <span className="truncate">{turf.location.address}, {turf.location.city}</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
            {turf.description}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Per Slot</p>
              <p className="text-green-500 font-black text-xl">₹{turf.pricePerSlot.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
              View & Book →
            </div>
          </div>

          {/* Timing */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>🕐 {turf.openingTime} – {turf.closingTime}</span>
            <span>⏱ {turf.slotDuration} min slots</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Turfs;