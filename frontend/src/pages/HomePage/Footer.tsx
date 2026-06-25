
import {NavLink} from "react-router-dom";
import logo from "../../assets/image.png"; 

import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const footerLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-colors duration-300 ${
    isActive
      ? "text-green-500 font-medium"
      : "text-gray-400 hover:text-green-500"
  }`;

const Footer = () => {
    
  return (
    <footer className="bg-[#111827] text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo */}
          <div>
            <NavLink to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="TurfHub"
                className="w-16 h-16 object-contain"
              />

              <div>
                <h2 className="text-3xl font-bold">
                  <span className="text-green-500">Turf</span>Hub
                </h2>

                <p className="text-sm text-gray-400">
                  Your Game, Your Turf
                </p>
              </div>
            </NavLink>

            <p className="text-gray-400 mt-5 leading-7">
              Your one-stop solution to find,
              <br />
              book and play at the best
              <br />
              turfs in town.
            </p>

            <div className="flex gap-4 mt-3">

              <a
                href="#"
                className="w-11 h-11 rounded-full border border-gray-500 flex items-center justify-center hover:bg-green-600 hover:border-green-600 duration-300"
              >
                <FaFacebookF />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full border border-gray-500 flex items-center justify-center hover:bg-green-600 hover:border-green-600 duration-300"
              >
                <FaInstagram />
              </a>

              <a
                href="#"
                className="w-11 h-11 rounded-full border border-gray-500 flex items-center justify-center hover:bg-green-600 hover:border-green-600 duration-300"
              >
                <FaTwitter />
              </a>

            </div>
          </div>

          {/* Quick Links */}

          <div>
            <h3 className="text-xl font-semibold mb-6">
              Quick Links
            </h3>

            <ul className="space-y-2 text-gray-400">

              <li>
                <NavLink to="/" className={footerLinkClass}>
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink to="/about" className={footerLinkClass}>
                  About
                </NavLink>
              </li>

              <li>
                <NavLink to="/turfs" className={footerLinkClass}>
                  Turfs
                </NavLink>
              </li>

              <li>
                <NavLink to="/contact" className={footerLinkClass}>
                  Contact
                </NavLink>
              </li>

            </ul>
          </div>

          {/* Support */}

          <div>
            <h3 className="text-xl font-semibold mb-6">
              Support
            </h3>

            <ul className="space-y-2 text-gray-400">

              <li>
                <NavLink to="#" className="text-gray-400 hover:text-green-500">
                  FAQ
                </NavLink>
              </li>

              <li>
                <NavLink to="#" className="text-gray-400 hover:text-green-500">
                  Terms & Conditions
                </NavLink>
              </li>

              <li>
                <NavLink to="#" className= "text-gray-400 hover:text-green-500">
                  Privacy Policy
                </NavLink>
              </li>

              <li>
                <NavLink to="/contact" className={footerLinkClass}>
                  Contact Us
                </NavLink>
              </li>

            </ul>
          </div>

          {/* Contact */}

          <div>
            <h3 className="text-xl font-semibold mb-6">
              Contact Us
            </h3>

            <div className="space-y-2 text-gray-400">

              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-green-500" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-4">
                <FaEnvelope className="text-green-500" />
                <span>support@turfhub.com</span>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-green-500 mt-1" />
                <span>Pune, Maharashtra, India</span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-gray-700 mt-6 pt-2 text-center text-gray-400">
          © 2026 TurfHub (Happy Yadav). All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;