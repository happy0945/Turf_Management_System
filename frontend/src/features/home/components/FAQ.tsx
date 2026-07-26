import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "What is the cancellation policy for turf bookings?",
      answer: "Bookings can be cancelled up to 24 hours before your slot for a full refund. Cancellations made within 24 hours are subject to a 50% cancellation fee, and refunds are credited back to your original payment method.",
    },
    {
      question: "Are stadium floodlight charges included in the booking fee?",
      answer: "Yes, all night slots (after 6:00 PM) automatically include full stadium floodlight services in the listed price. There are no additional hidden lighting charges.",
    },
    {
      question: "Can we rent bats, balls, and protective gear at the turf?",
      answer: "Absolutely! Most of our premium turfs offer cricket kit rentals (including bats, balls, pads, and helmets) for a small nominal fee. You can specify rental kits during checkout or hire them at the front desk.",
    },
    {
      question: "Is drinking water and locker facility available at the venues?",
      answer: "Yes, all listed venues are verified for standard amenities. You will have access to clean drinking water, private changing rooms, shower cubicles, secure locker storage, and vehicle parking.",
    },
  ];

  const handleToggle = (idx: number) => {
    setActiveIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto overflow-hidden">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-green-500 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
          Support
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-white mt-4">
          Frequently Asked Questions
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.01)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-colors duration-300"
            >
              {/* Question Header */}
              <button
                onClick={() => handleToggle(idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-800 dark:text-white hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300 focus:outline-none cursor-pointer"
              >
                <span>{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-slate-400 dark:text-slate-500 ml-4 flex-shrink-0"
                >
                  <FaChevronDown className="text-sm" />
                </motion.div>
              </button>

              {/* Answer Content Panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-2 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;
