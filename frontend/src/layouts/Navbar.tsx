import { useState, useEffect } from "react";
import logo from "../assets/image.png";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { FaFutbol, FaSun, FaMoon, FaSignOutAlt, FaChevronDown, FaCalendarCheck, FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Turfs", path: "/turfs" },
    { name: "Book Turf", path: "/book-turf" },
    { name: "Contacts", path: "/contacts" },
  ];

  // Monitor scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setShowUserDropdown(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    setShowUserDropdown(false);
    navigate("/");
  };

  // ── Nav background: always themed, scroll just adds more blur/shadow ─────────
  const navBg = scrolled
    ? isDark
      ? "bg-slate-950/80 backdrop-blur-xl border-white/8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
      : "bg-white/90 backdrop-blur-xl border-slate-200/70 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
    : isDark
    ? "bg-slate-950/30 backdrop-blur-md border-white/5 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
    : "bg-white/60 backdrop-blur-md border-slate-200/40 shadow-[0_4px_20px_rgba(0,0,0,0.05)]";

  // ── Text colour based purely on theme ────────────────────────────────────────
  const textBase = isDark ? "text-slate-300" : "text-slate-600";
  const textHover = isDark ? "hover:text-white" : "hover:text-slate-900";
  const textActive = isDark
    ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.55)]"
    : "text-green-600";

  // ── Button/input glass surface ───────────────────────────────────────────────
  const glassSurface = isDark
    ? "border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-white/20"
    : "border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-slate-300";

  const userName = user?.fullName || "";
  const userRole = user?.role || "";

  return (
    <div className="fixed top-3 left-0 w-full z-50 px-4 md:px-8 pointer-events-none">
      <nav
        className={`max-w-7xl mx-auto w-full rounded-2xl pointer-events-auto border transition-all duration-300 py-3 ${navBg}`}
      >
        <div className="flex items-center justify-between px-5">

          {/* ── Logo ──────────────────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="relative">
              <img
                src={logo}
                alt="TurfHub"
                className="h-10 w-10 rounded-full border border-green-500/30 group-hover:rotate-[360deg] transition-all duration-[800ms] shadow-sm"
              />
              <div className="absolute inset-0 rounded-full bg-green-500/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
            </div>
            <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-0.5 transition-colors duration-300 ${isDark ? "text-white" : "text-slate-800"}`}>
              <span className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-500 bg-clip-text text-transparent font-black">
                Turf
              </span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                Hub
              </span>
            </h2>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────────────────────── */}
          <div className="hidden md:flex items-center">
            <ul className="flex gap-1 font-semibold text-[15px]">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li
                    key={link.path}
                    className="relative px-3 py-2 cursor-pointer rounded-xl"
                    onMouseEnter={() => setHoveredLink(link.path)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <NavLink
                      to={link.path}
                      className={`relative z-10 transition-colors duration-200 ${
                        isActive ? textActive : `${textBase} ${textHover}`
                      }`}
                    >
                      {link.name}
                    </NavLink>

                    {/* Hover pill */}
                    {hoveredLink === link.path && (
                      <motion.div
                        layoutId="navHover"
                        className={`absolute inset-0 -z-10 rounded-xl border ${
                          isDark
                            ? "bg-white/[0.07] border-white/10"
                            : "bg-slate-900/[0.04] border-slate-200/60"
                        }`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── Desktop Right Actions ─────────────────────────────────────────── */}
          <div className="hidden md:flex items-center gap-3">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2.5 rounded-xl border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${glassSurface}`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -8, opacity: 0, rotate: -30 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 8, opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.18 }}
                >
                  {isDark ? (
                    <FaSun className="text-yellow-400 text-sm" />
                  ) : (
                    <FaMoon className="text-slate-500 text-sm" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {isLoggedIn ? (
              /* User dropdown */
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className={`flex items-center gap-2 p-1 pr-3 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
                    isDark
                      ? "border-white/10 bg-white/5 hover:border-green-500/40"
                      : "border-slate-200 bg-slate-50 hover:border-green-500/40"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-md overflow-hidden flex-shrink-0">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className={`text-sm font-bold flex items-center gap-1 ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                    {userName.split(" ")[0]}
                    <FaChevronDown className={`text-[9px] transition-transform duration-300 ${showUserDropdown ? "rotate-180" : ""}`} />
                  </span>
                </button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/8 rounded-2xl shadow-2xl p-2 z-[100]"
                    >
                      <div className="px-3 py-2 mb-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{userName}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
                          {userRole}
                        </span>
                      </div>
                      <div className="border-t border-slate-100 dark:border-white/5 my-1" />

                      {userRole === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2 w-full py-2 px-3 text-xs font-bold text-green-500 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition cursor-pointer"
                        >
                          <FaUser className="text-slate-400" /> Admin Dashboard
                        </Link>
                      )}
                      {userRole === "owner" && (
                        <Link
                          to="/owner"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2 w-full py-2 px-3 text-xs font-bold text-green-500 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition cursor-pointer"
                        >
                          <FaUser className="text-slate-400" /> Owner Dashboard
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 w-full py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition cursor-pointer"
                      >
                        <FaUser className="text-slate-400" /> My Profile
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 w-full py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition cursor-pointer"
                      >
                        <FaCalendarCheck className="text-slate-400" /> My Reservations
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full py-2 px-3 text-xs font-bold text-red-500 hover:bg-red-500/5 rounded-xl transition border-t border-slate-100 dark:border-white/5 mt-1 cursor-pointer"
                      >
                        <FaSignOutAlt /> Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={`font-semibold py-2 px-4 rounded-xl transition-all duration-200 hover:-translate-y-px text-sm border ${glassSurface}`}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2 px-4 rounded-xl shadow-[0_4px_12px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_20px_rgba(34,197,94,0.4)] transition-all duration-200 hover:-translate-y-px text-sm"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* ── Mobile Controls ───────────────────────────────────────────────── */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={`p-2 rounded-xl border cursor-pointer transition-all duration-200 ${glassSurface}`}
            >
              {isDark ? <FaSun className="text-yellow-400 text-sm" /> : <FaMoon className="text-slate-500 text-sm" />}
            </button>

            <button
              className={`flex items-center justify-center p-2 rounded-xl border transition-all duration-200 cursor-pointer ${glassSurface}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Open menu"
            >
              {isOpen ? (
                <span className="text-lg leading-none font-bold">✕</span>
              ) : (
                <FaFutbol className="text-lg" />
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden md:hidden"
            >
              <div className={`mx-4 mt-3 mb-2 p-4 rounded-2xl border flex flex-col gap-4 ${
                isDark
                  ? "bg-slate-900/80 border-white/10"
                  : "bg-white border-slate-200"
              }`}>
                <ul className="flex flex-col gap-1 text-sm font-semibold">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <li key={link.path}>
                        <NavLink
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`block py-2.5 px-4 rounded-xl transition ${
                            isActive
                              ? "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20"
                              : isDark
                              ? "text-slate-300 hover:bg-white/5 hover:text-white"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {link.name}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>

                <div className={`flex flex-col gap-2 pt-3 border-t ${isDark ? "border-white/8" : "border-slate-100"}`}>
                  {isLoggedIn ? (
                    <>
                      <div className={`text-xs font-bold py-1 px-2 flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                        <div className="w-5 h-5 rounded-md bg-green-500 text-white flex items-center justify-center font-bold text-[10px]">
                          {userName.charAt(0).toUpperCase()}
                        </div>
                        Hi, {userName.split(" ")[0]}
                      </div>
                      {userRole === "admin" && (
                        <NavLink to="/admin" onClick={() => setIsOpen(false)}
                          className="text-center text-green-500 border border-green-500/20 py-2.5 rounded-xl font-bold text-xs block hover:bg-green-500/5 transition">
                          Admin Dashboard
                        </NavLink>
                      )}
                      {userRole === "owner" && (
                        <NavLink to="/owner" onClick={() => setIsOpen(false)}
                          className="text-center text-green-500 border border-green-500/20 py-2.5 rounded-xl font-bold text-xs block hover:bg-green-500/5 transition">
                          Owner Dashboard
                        </NavLink>
                      )}
                      <NavLink to="/profile" onClick={() => setIsOpen(false)}
                        className={`text-center border py-2.5 rounded-xl font-semibold text-xs block transition ${
                          isDark ? "text-slate-300 border-white/10 hover:bg-white/5" : "text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}>
                        My Profile &amp; Reservations
                      </NavLink>
                      <button onClick={handleLogout}
                        className="w-full text-center text-red-500 border border-red-500/20 py-2.5 rounded-xl font-bold bg-red-500/5 text-xs hover:bg-red-500/10 transition cursor-pointer">
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink to="/login" onClick={() => setIsOpen(false)}
                        className={`text-center border py-2.5 rounded-xl font-semibold text-sm transition ${
                          isDark ? "text-slate-300 border-white/10 hover:bg-white/5" : "text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}>
                        Login
                      </NavLink>
                      <NavLink to="/register" onClick={() => setIsOpen(false)}
                        className="text-center bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md transition">
                        Register
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
