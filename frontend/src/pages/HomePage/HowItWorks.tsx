import { motion } from "framer-motion";
import { FaSearch, FaRegClock, FaRegHandshake } from "react-icons/fa";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const HowItWorks = () => {
  const steps: Step[] = [
    {
      number: "01",
      title: "Discover Venues",
      description: "Browse verified sports turfs near your location with detailed specifications.",
      icon: <FaSearch className="text-green-500" />,
    },
    {
      number: "02",
      title: "Schedule Slot",
      description: "Pick your preferred date and time slot using our real-time availability chart.",
      icon: <FaRegClock className="text-emerald-500" />,
    },
    {
      number: "03",
      title: "Book & Play",
      description: "Complete checkout with secure gateways and receive instant confirmations.",
      icon: <FaRegHandshake className="text-teal-500" />,
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Title */}
      <div className="text-center mb-20">
        <span className="text-green-500 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Process
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-4">
          How TurfHub Works
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Steps Visual Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 justify-center"
      >
        {/* Decorative connecting line between steps (desktop only) */}
        <div className="absolute top-[35%] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-green-500/10 via-emerald-500/20 to-teal-500/10 hidden md:block z-0" />

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={stepVariants}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            {/* Step Icon Capsule */}
            <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center text-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.2)] group-hover:border-green-500/50 transition-colors duration-500 mb-6">
              {step.icon}
            </div>

            {/* Step Number Badge */}
            <span className="absolute top-0 right-[25%] sm:right-[35%] md:right-[20%] lg:right-[25%] bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-black px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              {step.number}
            </span>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
              {step.title}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed max-w-xs">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default HowItWorks;
