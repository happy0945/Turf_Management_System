import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaSpinner, FaUserCircle, FaFutbol } from "react-icons/fa";
import { Link } from "react-router-dom";
import Tilt from "./Tilt";
import { reviewService, type ReviewItem } from "../../../services/reviewService";

const Testimonials = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewService.getRecentReviews();
        setReviews(data);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Reviews
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-4">
          What Players Say
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Real feedback from verified players across listed venues
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center py-16">
          <FaSpinner className="animate-spin text-3xl text-green-500" />
        </div>
      ) : reviews.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 bg-white dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 text-2xl mx-auto">
            <FaFutbol />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Player Reviews Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Be the first athlete to book a venue, play a match, and post a review!
          </p>
          <Link
            to="/turfs"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-md shadow-green-500/20 transition"
          >
            Explore Turfs &amp; Book
          </Link>
        </div>
      ) : (
        /* Dynamic Real Reviews Grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviews.map((rev) => {
            const userName = rev.user?.fullName || "Verified Player";
            const turfName = typeof rev.turf === "object" && rev.turf?.turfName ? rev.turf.turfName : "Sports Venue";

            return (
              <motion.div key={rev._id} variants={cardVariants}>
                <Tilt className="h-full">
                  <div className="relative h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(34,197,94,0.06)] transition-all duration-300">
                    
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 text-green-500/10 dark:text-green-500/5 text-5xl pointer-events-none">
                      <FaQuoteLeft />
                    </div>

                    <div>
                      {/* Rating Stars */}
                      <div className="flex gap-1 mb-4 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${i < rev.rating ? "fill-current" : "text-slate-200 dark:text-slate-700"}`}
                          />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic line-clamp-4">
                        "{rev.comment}"
                      </p>
                    </div>

                    {/* Profile detail */}
                    <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                      {rev.user?.avatar ? (
                        <img
                          src={rev.user.avatar}
                          alt={userName}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                        />
                      ) : (
                        <FaUserCircle className="w-11 h-11 text-slate-400 flex-shrink-0" />
                      )}
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-extrabold text-slate-800 dark:text-white truncate">
                          {userName}
                        </h4>
                        <p className="text-xs text-green-600 dark:text-green-400 font-bold truncate">
                          Review for {turfName}
                        </p>
                      </div>
                    </div>

                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </section>
  );
};

export default Testimonials;
