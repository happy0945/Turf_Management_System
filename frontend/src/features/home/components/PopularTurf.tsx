import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaStar, FaArrowRight, FaRupeeSign, FaFutbol, FaSpinner } from "react-icons/fa";
import { turfService } from "../../../services/turfService";
import type { Turf } from "../../../services/turfService";

// ── Inline TurfCard (uses real API Turf type) ─────────────────────────────────
const TurfCard = ({ turf }: { turf: Turf }) => {
  const imageUrl = turf.images?.[0]?.url || "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop";
  const city = turf.location?.city || turf.location?.address || "—";
  const sports = turf.sportsType?.join(", ") || "Sports";

  return (
    <Link to={`/turf/${turf._id}`} className="group block h-full">
      <div className="h-full bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-green-500/40 dark:hover:border-green-500/40 rounded-2xl overflow-hidden shadow-sm dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(34,197,94,0.08)] dark:hover:shadow-[0_20px_40px_rgba(34,197,94,0.12)] transition-all duration-300 flex flex-col">

        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
          <img
            src={imageUrl}
            alt={turf.turfName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&auto=format&fit=crop";
            }}
          />
          {/* Price badge */}
          <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-0.5 shadow-sm">
            <FaRupeeSign className="text-[10px]" />
            {turf.pricePerSlot}/slot
          </div>
          {/* Sport badge */}
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white border border-white/10 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
            <FaFutbol className="text-green-400 text-[9px]" />
            {sports}
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Details */}
        <div className="p-4 flex flex-col gap-3 flex-grow">
          <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 line-clamp-1">
            {turf.turfName}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
            <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
            <span className="line-clamp-1">{city}</span>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
            {/* Rating */}
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-2.5 py-1 rounded-lg text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
              <FaStar className="fill-current text-[10px]" />
              <span>{(turf.rating ?? 5).toFixed(1)}</span>
            </div>

            {/* CTA */}
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 group-hover:gap-2 transition-all duration-200">
              Book Now
              <FaArrowRight className="text-[10px]" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ── Empty state ────────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center gap-4">
    <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 text-3xl">
      <FaFutbol />
    </div>
    <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No venues listed yet</h3>
    <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs">
      Turf owners are being onboarded. Check back soon or be the first to list your turf!
    </p>
    <Link
      to="/turfs"
      className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs transition shadow-md shadow-green-500/20"
    >
      Browse All Turfs <FaArrowRight className="text-[10px]" />
    </Link>
  </div>
);

// ── Main Section ───────────────────────────────────────────────────────────────
const PopularTurf = () => {
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await turfService.getAllTurfs();
        // Show top 4 by rating
        const sorted = [...data].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, 4);
        setTurfs(sorted);
      } catch {
        setTurfs([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center mb-14">
        <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Book Venues
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-4">
          Popular Venues Near You
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm max-w-xl mx-auto">
          Discover top-rated turfs in your city — all verified, all real-time bookable.
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <FaSpinner className="animate-spin text-3xl text-green-500" />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {turfs.length > 0 ? (
            turfs.map((turf) => (
              <motion.div key={turf._id} variants={cardVariants} className="h-full">
                <TurfCard turf={turf} />
              </motion.div>
            ))
          ) : (
            <EmptyState />
          )}
        </motion.div>
      )}

      {/* View All CTA */}
      {!loading && turfs.length > 0 && (
        <div className="text-center mt-12">
          <Link
            to="/turfs"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-2xl text-sm transition-all duration-200 shadow-md shadow-green-500/20 hover:shadow-green-500/30 hover:-translate-y-0.5"
          >
            View All Venues
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default PopularTurf;
