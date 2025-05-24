import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-[#575B91]">
          <Link to="/">Dropillo</Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-8 items-center">
          <Link to="/home" className="text-gray-700 hover:text-[#575B91] transition">Home</Link>
          <Link to="/rooms" className="text-gray-700 hover:text-[#575B91] transition">Rooms</Link>
          <Link to="/equipment" className="text-gray-700 hover:text-[#575B91] transition">Equipment</Link>
          <Link to="/about" className="text-gray-700 hover:text-[#575B91] transition">About</Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <Link
            to="/book"
            className="bg-[#575B91] text-white px-4 py-2 rounded hover:bg-[#46497a] transition"
          >
            Book Now
          </Link>
        </div>

        {/* Hamburger Icon */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-2xl text-[#575B91] focus:outline-none">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md px-4 py-4 space-y-4">
          <Link to="/home" className="block text-gray-700 hover:text-[#575B91]" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/rooms" className="block text-gray-700 hover:text-[#575B91]" onClick={toggleMenu}>
            Rooms
          </Link>
          <Link to="/equipment" className="block text-gray-700 hover:text-[#575B91]" onClick={toggleMenu}>
            Equipment
          </Link>
          <Link to="/about" className="block text-gray-700 hover:text-[#575B91]" onClick={toggleMenu}>
            About
          </Link>
          <Link
            to="/book"
            onClick={toggleMenu}
            className="inline-block w-full bg-[#575B91] text-white text-center py-2 rounded hover:bg-[#46497a] transition"
          >
            Book Now
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
