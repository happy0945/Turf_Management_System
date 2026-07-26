import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import Tilt from "./Tilt";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  review: string;
}

const Testimonials = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Rohit Sharma",
      role: "Club Captain",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      rating: 5,
      review: "Booking matches used to require multiple phone calls. With TurfHub, I booked our weekend slot in under 2 minutes. The pitch quality was absolutely top-notch!",
    },
    {
      name: "Sanjana Roy",
      role: "Football Player",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      rating: 5,
      review: "The live availability feature is a lifesaver. We immediately saw which slots were open and paid securely. Seamless confirmation and great service support.",
    },
    {
      name: "Vikram Malhotra",
      role: "Weekend Athlete",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      rating: 4.8,
      review: "Clean venues, verified photos, and direct booking support. TurfHub has elevated our corporate matches. Highly recommend it to all sports organizers.",
    },
  ];

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
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-green-500 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Reviews
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-4">
          What Players Say
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Cards container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {testimonials.map((t, idx) => (
          <motion.div key={idx} variants={cardVariants}>
            <Tilt className="h-full">
              <div className="relative h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-8 rounded-2xl flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(34,197,94,0.06)]">
                
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-green-500/10 dark:text-green-500/5 text-5xl">
                  <FaQuoteLeft />
                </div>

                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} className="text-sm fill-current" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                    "{t.review}"
                  </p>
                </div>

                {/* Profile detail */}
                <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">
                      {t.name}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">
                      {t.role}
                    </p>
                  </div>
                </div>

              </div>
            </Tilt>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
