
import cricketBg from "../../assets/cricket-ground.png";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section
      className="relative h-[90vh] bg-cover bg-center"
      style={{
        backgroundImage: `url(${cricketBg})`,
      }}
    >
      {/* Green + Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 via-black/60 to-black/40"></div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="max-w-3xl px-8 md:px-16 text-white">
          {/* Subtitle */}
          <p className="text-green-400 uppercase tracking-[4px] font-semibold mb-4">
            Play • Book • Enjoy
          </p>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
          >
            Book Your Favorite
            <br />
            Cricket Turf
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.8,
            }}
            className="mt-6 text-lg md:text-xl text-gray-100 max-w-xl leading-relaxed"
          >
            Find and book the best cricket turfs near you.
            <br />
            Easy booking, instant confirmation, and hassle-free scheduling.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 0.8,
            }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <button className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg text-white font-semibold shadow-lg transition-all duration-300">
              Book Now
            </button>

            <button className="border-2 border-green-500 px-8 py-3 rounded-lg text-green-400 hover:bg-green-600 hover:text-white transition-all duration-300">
              Explore Turfs
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.2,
              duration: 0.8,
            }}
            className="mt-12 flex gap-8"
          >
            <div>
              <h3 className="text-3xl font-bold text-green-400">500+</h3>
              <p className="text-gray-300">Turfs Listed</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-green-400">10K+</h3>
              <p className="text-gray-300">Bookings</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-green-400">4.9★</h3>
              <p className="text-gray-300">User Rating</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white animate-bounce text-2xl">
        ↓
      </div> */}
    </section>
    )
}
export default Hero;