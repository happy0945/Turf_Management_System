<<<<<<< HEAD
import { useState } from "react";
import logo from "../assets/image.png";
import { NavLink, Link } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ?
  "text-green-600 font-semibold" 
  : "text-gray-700 hover:text-green-600 transition";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="flex items-center gap-2 p-4">
        <div className="text-lg font-bold">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-6 w-6 inline-block mr-1 rounded-full"
            />
           <h2 className="text-3xl font-bold">
                  <span className="text-green-500">Turf</span>Hub
                </h2>
          </Link>
        </div>
        {/* creating list of about contact etc */}
        <div className=" hidden md:flex ml-auto">
          <ul className="flex gap-8 text-gray-700 font-semibold ">
            <li>
              <NavLink to="/" className={navLinkClass} >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClass} >
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/turfs" className={navLinkClass}>
                Turfs
              </NavLink>
            </li>
            <li>
              <NavLink to="/book-turf" className={navLinkClass}>
                BookTurf
              </NavLink>
            </li>
            <li>
              <NavLink to="/contacts" className={navLinkClass}>
                Contacts
              </NavLink>
            </li>
          </ul>
        </div>
        {/* login and register buttons */}
        <div className=" hidden md:flex ml-4">
          <NavLink to='/login' className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold py-2 px-5 rounded-lg transition mr-2">
            Login
          </NavLink>
          <NavLink to='/register' className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition">
            Register
          </NavLink>
        </div>

        {/* Mobile View */}
        <button
          className="md:hidden text-2xl ml-auto text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>
      </div>


      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col gap-4 px-4 pb-4 bg-white border-t border-gray-200">
          <li>
              <NavLink to="/" className={navLinkClass} >
                Home
              </NavLink>
            </li>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>

          <NavLink to="/turfs" className={navLinkClass}>
            Turfs
          </NavLink>

          <NavLink to="/book-turf" className={navLinkClass}>
            BookTurf
          </NavLink>

          <NavLink to="/contacts" className={navLinkClass}>
            Contacts
          </NavLink>

          <NavLink to='/login' className="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-4 py-2 rounded-lg mr-2 transition">
  Login
</NavLink>

          <NavLink to='/register' className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition mr-2">
  Register
</NavLink>
        </div>
      )}
    </nav>
=======
import { useState, useEffect } from "react";
import logo from "../assets/image.png";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { FaFutbol, FaSun, FaMoon, FaSignOutAlt, FaChevronDown, FaCalendarCheck } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Turfs", path: "/turfs" },
    { name: "Book Turf", path: "/book-turf" },
    { name: "Contacts", path: "/contacts" },
  ];

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("theme");
    return (saved as "light" | "dark") || "dark";
  });

  // Apply theme class on mount and when theme changes
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Monitor auth state changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("userToken");
      const name = localStorage.getItem("userName") || "";
      setIsLoggedIn(!!token);
      setUserName(name);
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    const interval = setInterval(checkAuth, 1000);
    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  // Monitor scroll height
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const closeDropdown = () => setShowUserDropdown(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    setUserName("");
    setIsOpen(false);
    setShowUserDropdown(false);
    navigate("/");
  };

  // Determine if we should display dark/light design styling (either dark mode is enabled OR we are at the top, meaning we are over the dark Hero header)
  const isDarkStyled = theme === "dark" || !scrolled;

  return (
    <div className="fixed top-3 left-0 w-full z-50 px-4 md:px-8 pointer-events-none">
      <nav
        className={`max-w-7xl mx-auto w-full rounded-2xl pointer-events-auto border transition-all duration-500 ${
          scrolled
            ? theme === "light"
              ? "bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-[0_15px_40px_rgba(0,0,0,0.06)] py-3"
              : "bg-slate-950/75 backdrop-blur-xl border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] py-3"
            : "bg-slate-950/20 backdrop-blur-md border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.15)] py-4"
        }`}
      >
        <div className="flex items-center justify-between px-6">
          {/* Logo */}
          <div className="text-lg font-bold">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-11 w-11 inline-block rounded-full border border-green-500/30 group-hover:rotate-[360deg] transition-all duration-[800ms] shadow-sm"
                />
                <div className="absolute inset-0 rounded-full bg-green-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
              </div>
              <h2 className={`text-2xl font-extrabold tracking-tight flex items-center gap-1 transition-colors duration-300 ${
                isDarkStyled ? "text-white" : "text-slate-800"
              }`}>
                <span className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 dark:from-green-450 dark:via-green-300 dark:to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(74,222,128,0.2)] font-black">
                  Turf
                </span>
                <span className="relative group-hover:translate-x-0.5 transition-transform duration-300">
                  Hub
                </span>
              </h2>
            </Link>
          </div>

          {/* Navigation Links (Desktop with spring slider hover) */}
          <div className="hidden md:flex items-center">
            <ul className="flex gap-6.5 font-extrabold text-[17px] tracking-wide">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li
                    key={link.path}
                    className="relative px-3.5 py-2 cursor-pointer rounded-xl transition-all duration-300"
                    onMouseEnter={() => setHoveredLink(link.path)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <NavLink
                      to={link.path}
                      className={() =>
                        isActive
                          ? isDarkStyled
                            ? "text-green-400 font-extrabold drop-shadow-[0_0_8px_rgba(74,222,128,0.55)]"
                            : "text-green-600 font-extrabold"
                          : isDarkStyled
                          ? "text-slate-300 hover:text-white"
                          : "text-slate-650 hover:text-slate-900"
                      }
                    >
                      {link.name}
                    </NavLink>

                    {/* Sliding Hover Pill */}
                    {hoveredLink === link.path && (
                      <motion.div
                        layoutId="navHover"
                        className={`absolute inset-0 -z-10 rounded-xl border ${
                          isDarkStyled
                            ? "bg-white/[0.08] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.35)]"
                            : "bg-slate-900/[0.05] border-slate-200/50 shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}

                    {/* Active Link Glow Point */}
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_12px_rgba(34,197,94,1.0)]"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CTA Buttons + Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition-all duration-305 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden group ${
                isDarkStyled
                  ? "border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/20"
                  : "border-slate-200 bg-slate-900/5 text-slate-650 hover:text-slate-900 hover:border-slate-300"
              }`}
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -10, opacity: 0, rotate: -45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon />}
                </motion.div>
              </AnimatePresence>
            </button>

            {isLoggedIn ? (
              /* User Card Profile Dropdown */
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center gap-2 p-1 rounded-xl border transition cursor-pointer select-none ${
                    isDarkStyled
                      ? "border-white/10 bg-white/5 hover:border-green-500/35 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                      : "border-slate-200 bg-slate-900/5 hover:border-green-500/25 hover:shadow-[0_0_15px_rgba(34,197,94,0.05)]"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className={`text-sm font-bold px-1 flex items-center gap-1.5 ${
                    isDarkStyled ? "text-slate-200" : "text-slate-700"
                  }`}>
                    <span>{userName}</span>
                    <FaChevronDown className={`text-[10px] transition-transform duration-300 ${showUserDropdown ? "rotate-180" : ""}`} />
                  </span>
                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-52 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-2xl p-2 z-[100]"
                    >
                      <button
                        onClick={() => {
                          alert("Bookings page routing mock");
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition flex items-center gap-2 cursor-pointer"
                      >
                        <FaCalendarCheck className="text-slate-400" />
                        <span>My Reservations</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-2.5 px-4 text-xs font-bold text-red-500 hover:bg-red-550/5 dark:hover:bg-red-500/10 rounded-xl transition flex items-center gap-2 border-t border-slate-100 dark:border-slate-900 mt-1 pt-2 cursor-pointer"
                      >
                        <FaSignOutAlt className="text-xs" />
                        <span>Sign out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Standard login register actions */
              <>
                <NavLink
                  to="/login"
                  className={`font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 hover:translate-y-[-2px] active:translate-y-0 text-sm border ${
                    isDarkStyled
                      ? "text-slate-350 hover:text-white bg-white/5 border-white/10 hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.25)]"
                      : "text-slate-650 hover:text-slate-900 bg-slate-900/5 border-slate-205 hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                  }`}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-[0_4px_12px_rgba(34,197,94,0.2)] hover:shadow-[0_4px_20px_rgba(34,197,94,0.4)] transition-all duration-300 hover:translate-y-[-2px] active:translate-y-0 text-sm"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile View Toggle */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border cursor-pointer ${
                isDarkStyled
                  ? "border-white/10 bg-white/5 text-slate-305"
                  : "border-slate-205 bg-slate-900/5 text-slate-600"
              }`}
            >
              {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>

            <button
              className={`flex items-center justify-center p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                isDarkStyled
                  ? "bg-white/5 border-white/10 text-slate-300 hover:text-white"
                  : "bg-slate-900/5 border-slate-205 text-slate-600 hover:text-slate-900"
              }`}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <span className="text-xl leading-none font-bold">✕</span>
              ) : (
                <FaFutbol className="text-xl animate-spin-slow" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 mx-4 p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <ul className="flex flex-col gap-2 text-slate-700 dark:text-slate-300 font-semibold text-sm">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className={() =>
                        `block py-3 px-4 rounded-xl transition ${
                          isActive
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                            : "hover:bg-slate-900/5 dark:hover:bg-white/5"
                        }`
                      }
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-slate-100 dark:border-white/5">
              {isLoggedIn ? (
                <>
                  <div className="text-center text-xs font-bold text-slate-550 py-1 flex items-center justify-center gap-2">
                    <div className="w-5 h-5 rounded bg-green-500 text-white flex items-center justify-center font-bold text-[10px]">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span>Hi, {userName}</span>
                  </div>
                  <button
                    onClick={() => {
                      alert("Bookings page routing mock");
                      setIsOpen(false);
                    }}
                    className="w-full text-center text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 py-2.5 rounded-xl transition cursor-pointer font-semibold bg-slate-50 dark:bg-white/5 text-xs"
                  >
                    My Reservations
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center text-red-500 border border-red-500/20 py-2.5 rounded-xl transition cursor-pointer font-bold bg-red-500/5 text-xs"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="text-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 py-2.5 rounded-xl transition font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="text-center bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-semibold shadow-md transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
  );
};

export default Navbar;
