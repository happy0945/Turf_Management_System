import { motion } from "framer-motion";
import aboutBg from "../assets/cricket-ground.png";
import aboutImage from "../assets/turfImages/turf2.jpg";
import Footer from "../layout/Footer";
import { Link } from "react-router-dom";
import Tilt from "./HomePage/Tilt";

import {
  FaBullseye,
  FaCalendarCheck,
  FaEye,
  FaFutbol,
  FaHeadset,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

const About = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-[45vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${aboutBg})`,
        }}
      >
        <div className="absolute inset-0 bg-slate-950/70 z-0"></div>

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center px-4">
            <span className="text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              Overview
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mt-4">
              About TurfHub
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-200 max-w-xl mx-auto leading-relaxed">
              Eliminating friction from sports venue bookings to keep players active, healthy, and connected.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <Tilt>
            <img
              src={aboutImage}
              alt="About TurfHub"
              className="rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.4)] w-full h-[400px] object-cover"
            />
          </Tilt>

          <div>
            <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4">
              Connecting Athletics
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-4 mb-6" />

            <p className="text-slate-500 dark:text-slate-450 leading-relaxed text-sm mb-4">
              TurfHub is a modern sports turf booking platform designed to connect players with premium sports venues. Whether you're planning a football match, cricket practice, badminton game, or a friendly weekend tournament, we make booking simple, quick, and hassle-free.
            </p>

            <p className="text-slate-500 dark:text-slate-450 leading-relaxed text-sm mb-8">
              Our goal is to eliminate the inconvenience of calling multiple venues and waiting for confirmations. With TurfHub, users can browse verified turfs, compare facilities, check live availability, and book instantly—all in one place.
            </p>

            <Link
              to="/turfs"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition text-sm cursor-pointer inline-block"
            >
              Explore Turfs
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-100/50 dark:bg-slate-900/10 border-y border-slate-200 dark:border-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mt-4">
              Why Choose Us
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: <FaCalendarCheck />,
                title: "Easy Booking",
                desc: "Select a date and secure a verified turf slot in under two minutes.",
              },
              {
                icon: <FaFutbol />,
                title: "Verified Venues",
                desc: "All listed facilities are fully vetted for dimensions and high-quality turfs.",
              },
              {
                icon: <FaShieldAlt />,
                title: "Secure Checkouts",
                desc: "Safe online payment processing using secure UPI and credit cards.",
              },
              {
                icon: <FaHeadset />,
                title: "24/7 Assistance",
                desc: "Get fast responsive customer care services whenever you need support.",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Tilt className="h-full">
                  <div className="h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-green-500/30 p-8 rounded-2xl text-center flex flex-col items-center justify-between transition-colors duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-gradient-to-br dark:from-green-500/20 dark:to-emerald-500/20 border border-slate-100 dark:border-green-500/30 flex items-center justify-center text-3xl text-green-605 dark:text-green-400 mb-6 shadow-sm">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 border-l-4 border-l-green-500 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <FaBullseye className="text-green-500 text-4xl mb-5" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              Our Mission
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              To simplify sports venue bookings by providing a fast, reliable, and transparent platform where players can easily discover, compare, and reserve the best turfs in their neighborhood.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 border-l-4 border-l-green-500 shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <FaEye className="text-green-500 text-4xl mb-5" />
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              Our Vision
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              To become the nation's most trusted sports booking community by making athletics accessible and promoting active, healthy, and sports-driven lifestyles across every town.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-16 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <FaFutbol className="text-4xl mx-auto mb-3" />
            <h2 className="text-4xl font-extrabold">120+</h2>
            <p className="text-xs uppercase tracking-wider font-bold mt-1 opacity-90">Turfs Listed</p>
          </div>
          <div>
            <FaUsers className="text-4xl mx-auto mb-3" />
            <h2 className="text-4xl font-extrabold">10K+</h2>
            <p className="text-xs uppercase tracking-wider font-bold mt-1 opacity-90">Happy Players</p>
          </div>
          <div>
            <FaMapMarkedAlt className="text-4xl mx-auto mb-3" />
            <h2 className="text-4xl font-extrabold">25+</h2>
            <p className="text-xs uppercase tracking-wider font-bold mt-1 opacity-90">Cities Covered</p>
          </div>
          <div>
            <FaCalendarCheck className="text-4xl mx-auto mb-3" />
            <h2 className="text-4xl font-extrabold">50K+</h2>
            <p className="text-xs uppercase tracking-wider font-bold mt-1 opacity-90">Bookings Served</p>
          </div>
        </div>
      </section>

      {/* Ready To Play Call to Action */}
      <section className="py-24 max-w-4xl mx-auto text-center px-6">
        <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-12 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.02)]">
          <h2 className="text-3xl md:text-5xl font-black text-slate-805 dark:text-white">
            Ready to Play?
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Discover the best sports venues near you and book your favorite turf in just a few clicks.
          </p>

          <Link
            to="/turfs"
            className="mt-8 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-xl shadow-md transition text-sm cursor-pointer inline-block"
          >
            Book Your Turf
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;