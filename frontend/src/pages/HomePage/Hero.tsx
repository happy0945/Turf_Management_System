
import cricketBg from "../../assets/cricket-ground.png";
import { motion } from "framer-motion";
import InteractiveCanvas from "./InteractiveCanvas";
import { FaArrowRight, FaPlay } from "react-icons/fa";

const Hero = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as const },
    },
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center py-24 px-6"
      style={{
        backgroundImage: `url(${cricketBg})`,
      }}
    >
      {/* Deep Dark/Green Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/45 to-slate-950 z-0"></div>

      {/* Interactive 3D Particle Canvas Background */}
      <div className="absolute inset-0 z-10 opacity-80 pointer-events-none">
        <InteractiveCanvas />
      </div>

      {/* Glowing Ambient Spotlights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none z-10" />

      {/* Center-aligned Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        {/* Subtitle Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-8 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 absolute" />
          <p className="text-green-400 text-xs md:text-sm uppercase tracking-widest font-semibold">
            Play • Book • Enjoy
          </p>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.05] text-white"
        >
          Book Your Favorite
          <br />
          <span className="bg-gradient-to-r from-green-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(74,222,128,0.25)]">
            Cricket Turf
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mt-8 text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-medium"
        >
          Discover and book the finest cricket pitches in town. Experience hassle-free scheduling, live slot availability, and instant confirmations.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-wrap gap-4 justify-center"
        >
          <button
            className="group flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.5)] transition-all duration-300 hover:translate-y-[-2px] active:translate-y-0 cursor-pointer"
          >
            <span>Book Now</span>
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            className="group flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold py-3.5 px-8 rounded-xl backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px] active:translate-y-0 hover:bg-white/10 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs group-hover:bg-green-500 group-hover:text-white transition-all">
              <FaPlay className="ml-0.5 text-[8px]" />
            </div>
            <span>Explore Turfs</span>
          </button>
        </motion.div>

        {/* Horizontal Stats */}
        <motion.div
          variants={itemVariants}
          className="mt-16 grid grid-cols-3 gap-8 sm:gap-16 border-t border-white/5 pt-10 w-full max-w-xl"
        >
          <div className="text-center">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">500+</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold uppercase tracking-wider">Turfs Listed</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-green-400">10K+</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold uppercase tracking-wider">Bookings</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white">4.9★</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-semibold uppercase tracking-wider">User Rating</p>
          </div>
        </motion.div>
      </motion.div>

      {/* 3D Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none opacity-60">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center p-1.5">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1.5 h-1.5 bg-green-400 rounded-full"
          />
        </div>
        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Scroll</span>
      </div>
    </section>
  );
};

export default Hero;