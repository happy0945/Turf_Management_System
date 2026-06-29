
<<<<<<< HEAD
// generate popular turf cards using map function by using the turfdata.tsx and turfcard.tsx 

import turfData from "./TurfData";
import TurfCard from "./TurfCard"

const PopularTurf = () =>{

    return (
        <section className="pr-12 pl-12 mt-12">
            <h2 className="text-3xl font-bold text-center mb-8 underline decoration-green-300 decoration-4 underline-offset-16">Popular Turfs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {turfData.map((turf) => (
          <TurfCard
            key={turf.id}
            image={turf.image}
            name={turf.name}
            location={turf.location}
            pricePerHour={turf.pricePerHour}
            rating={turf.rating}
          />
        ))}
            </div>
        </section>
    )
}

export default PopularTurf
=======
import turfData from "./TurfData";
import TurfCard from "./TurfCard";
import { motion } from "framer-motion";

const PopularTurf = () => {
  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Book Venues
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-4">
          Popular Venues Near You
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Grid containing turf cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center"
      >
        {turfData.map((turf) => (
          <motion.div key={turf.id} variants={cardVariants}>
            <TurfCard
              image={turf.image}
              name={turf.name}
              location={turf.location}
              pricePerHour={turf.pricePerHour}
              rating={turf.rating}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PopularTurf;
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
