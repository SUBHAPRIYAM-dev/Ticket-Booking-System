import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for menu toggle

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // To highlight active links

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">Dream Fest 2K25</h1>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links (Hidden on mobile, shown on larger screens) */}
        <nav className="hidden lg:flex space-x-6">
          <NavLink to="/" label="Home" location={location} />
          <NavLink to="/register" label="Book Ticket" location={location} />
          <NavLink to="/admin/login" label="Admin" location={location} />
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <nav className="lg:hidden bg-blue-700 mt-2 p-4 rounded-md">
          <NavLink to="/" label="Home" location={location} mobile />
          <NavLink to="/register" label="Book Ticket" location={location} mobile />
          <NavLink to="/admin/login" label="Admin" location={location} mobile />
        </nav>
      )}
    </header>
  );
};

// ✅ Reusable NavLink Component (Handles Active Links)
const NavLink = ({ to, label, location, mobile }) => (
  <Link
    to={to}
    className={`block ${mobile ? "py-2" : ""} text-lg ${
      location.pathname === to ? "text-yellow-300 font-bold" : "text-white"
    } hover:text-yellow-300 transition`}
  >
    {label}
  </Link>
);

export default Header;
