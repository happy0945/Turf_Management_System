

import aboutBg from "../assets/cricket-ground.png";
import aboutImage from "../assets/turfImages/turf2.jpg";

import Footer from "../layout/Footer";

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
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative h-[45vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${aboutBg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold">
              About TurfHub
            </h1>

            <p className="mt-4 text-lg md:text-xl text-gray-200">
              Book Your Favourite Sports Turf Anytime, Anywhere
            </p>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <img
            src={aboutImage}
            alt="About TurfHub"
            className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
          />

          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Who We Are
            </h2>

            <div className="w-24 h-1 bg-green-600 rounded-full mt-3 mb-6"></div>

            <p className="text-gray-600 leading-8">
              TurfHub is a modern sports turf booking platform designed to
              connect players with premium sports venues. Whether you're planning
              a football match, cricket practice, badminton game, or a friendly
              weekend tournament, we make booking simple, quick, and hassle-free.
            </p>

            <p className="text-gray-600 leading-8 mt-5">
              Our goal is to eliminate the inconvenience of calling multiple
              venues and waiting for confirmations. With TurfHub, users can
              browse available turfs, compare facilities, check live
              availability, and book instantly—all in one place.
            </p>

            <button className="mt-8 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition">
              Explore Turfs
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800">
              Why Choose Us
            </h2>

            <div className="w-24 h-1 bg-green-600 rounded-full mx-auto mt-3"></div>

            <p className="text-gray-500 mt-5">
              Everything you need for a seamless sports booking experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
            {[
              {
                icon: <FaCalendarCheck />,
                title: "Easy Booking",
                desc: "Reserve your turf within minutes.",
              },
              {
                icon: <FaFutbol />,
                title: "Verified Turfs",
                desc: "Premium and trusted sports venues.",
              },
              {
                icon: <FaShieldAlt />,
                title: "Secure Payment",
                desc: "Safe and reliable online transactions.",
              },
              {
                icon: <FaHeadset />,
                title: "24/7 Support",
                desc: "Dedicated customer assistance anytime.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl mx-auto">
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold mt-5">
                  {item.title}
                </h3>

                <p className="text-gray-500 mt-3">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded-xl shadow-lg p-10 border-l-4 border-green-600">
            <FaBullseye className="text-green-600 text-4xl mb-5" />

            <h2 className="text-3xl font-bold">
              Our Mission
            </h2>

            <p className="mt-5 text-gray-600 leading-8">
              To simplify sports venue booking by providing a fast, reliable,
              and transparent platform where players can easily discover and
              reserve the best turfs.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-10 border-l-4 border-green-600">
            <FaEye className="text-green-600 text-4xl mb-5" />

            <h2 className="text-3xl font-bold">
              Our Vision
            </h2>

            <p className="mt-5 text-gray-600 leading-8">
              To become India's most trusted sports booking platform by making
              sports more accessible and encouraging active lifestyles across
              every city.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div>
            <FaFutbol className="text-4xl mx-auto mb-3" />
            <h2 className="text-4xl font-bold">120+</h2>
            <p>Turfs Listed</p>
          </div>

          <div>
            <FaUsers className="text-4xl mx-auto mb-3" />
            <h2 className="text-4xl font-bold">10K+</h2>
            <p>Happy Players</p>
          </div>

          <div>
            <FaMapMarkedAlt className="text-4xl mx-auto mb-3" />
            <h2 className="text-4xl font-bold">25+</h2>
            <p>Cities</p>
          </div>

          <div>
            <FaCalendarCheck className="text-4xl mx-auto mb-3" />
            <h2 className="text-4xl font-bold">50K+</h2>
            <p>Bookings</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold text-gray-800">
            Ready to Play?
          </h2>

          <p className="mt-5 text-gray-600 text-lg">
            Discover the best sports venues near you and book your favourite
            turf in just a few clicks.
          </p>

          <button className="mt-8 bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-lg text-lg transition">
            Book Your Turf
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;