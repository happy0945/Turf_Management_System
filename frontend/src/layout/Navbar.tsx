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
  );
};

export default Navbar;
