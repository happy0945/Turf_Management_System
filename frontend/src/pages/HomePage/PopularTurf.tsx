
import { useState, useEffect } from "react";
import turfData from "./TurfData";
import TurfCard from "./TurfCard";
import { motion } from "framer-motion";

const PopularTurf = () => {
  const [turfList, setTurfList] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const local = localStorage.getItem("turfCatalogData");
      if (local) {
        setTurfList(JSON.parse(local).slice(0, 4));
      } else {
        setTurfList(turfData.slice(0, 4));
      }
    };
    loadData();
    window.addEventListener("storage", loadData);
    const interval = setInterval(loadData, 2000);
    return () => {
      window.removeEventListener("storage", loadData);
      clearInterval(interval);
    };
  }, []);

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
        {turfList.map((turf) => (
          <motion.div key={turf.id} variants={cardVariants}>
            <TurfCard
              image={turf.image}
              name={turf.name}
              location={turf.location}
              pricePerHour={turf.pricePerHour}
              rating={turf.rating}
              ownerId={turf.ownerId}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PopularTurf;
