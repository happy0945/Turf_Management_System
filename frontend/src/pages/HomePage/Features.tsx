import { FaCalendarAlt, FaCreditCard, FaCheckCircle, FaClipboardList } from "react-icons/fa";
import { motion } from "framer-motion";
import Tilt from "./Tilt";

const Features = () => {
  const features = [
    {
      title: "Easy Booking",
      description: "Book your favorite cricket turfs with just a few clicks.",
      icon: <FaClipboardList />,
    },
    {
      title: "Live Availability",
      description: "Check real-time availability of turfs before booking.",
      icon: <FaCalendarAlt />,
    },
    {
      title: "Secure Payment",
      description: "Make payments securely through our trusted gateway.",
      icon: <FaCreditCard />,
    },
    {
      title: "Instant Confirmation",
      description: "Get instant confirmation of your bookings.",
      icon: <FaCheckCircle />,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="relative py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Features
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-4">
          Why Book Through Us?
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Grid of features */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={cardVariants}>
            <Tilt className="h-full">
              <div className="h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-green-500/30 p-8 rounded-2xl text-center flex flex-col items-center justify-between transition-colors duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_35px_rgba(34,197,94,0.08)]">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-500/20 border border-slate-100 dark:border-green-500/30 flex items-center justify-center text-3xl text-green-600 dark:text-green-400 mb-6 shadow-sm dark:shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </Tilt>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;