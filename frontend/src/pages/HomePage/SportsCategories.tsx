import { motion } from "framer-motion";
import Tilt from "./Tilt";

interface Category {
  name: string;
  count: string;
  icon: React.ReactNode;
}

const SportsCategories = () => {
  const categories: Category[] = [
    {
      name: "Cricket",
      count: "12 Venues",
      icon: (
        <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      count: "8 Venues",
      icon: (
        <svg className="w-12 h-12 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20" />
          <path d="M2 12h20" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      name: "Tennis",
      count: "5 Venues",
      icon: (
        <svg className="w-12 h-12 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
          <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10" />
          <path d="M2 12h20" />
        </svg>
      ),
    },
    {
      name: "Basketball",
      count: "4 Venues",
      icon: (
        <svg className="w-12 h-12 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M6.2 6.2C9 3.4 15 3.4 17.8 6.2c2.8 2.8 2.8 8.8 0 11.6-2.8 2.8-8.8 2.8-11.6 0-2.8-2.8-2.8-8.8 0-11.6" />
          <path d="M2 12h20" />
          <path d="M12 2v20" />
        </svg>
      ),
    },
    {
      name: "Badminton",
      count: "6 Venues",
      icon: (
        <svg className="w-12 h-12 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
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
        <span className="text-green-500 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Sports categories
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-4">
          Select Your Sport
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Grid of Categories */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
      >
        {categories.map((cat, idx) => (
          <motion.div key={idx} variants={cardVariants}>
            <Tilt className="h-full">
              <div className="group h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-green-500/30 p-8 rounded-2xl text-center flex flex-col items-center justify-center transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(34,197,94,0.08)]">
                <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm dark:shadow-none">
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-300 mb-1">
                  {cat.name}
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">
                  {cat.count}
                </p>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default SportsCategories;
