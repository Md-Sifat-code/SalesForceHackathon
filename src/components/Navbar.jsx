import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    // Add actual logout logic here
    alert('Logged out!');
    setDropdownOpen(false);
    navigate('/login'); // Redirect to login page
  };

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Equipment', path: '/equipment' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-[#575B91]">
          <Link to="/home">
            <img className="w-[50px] h-[50px]" src="/logo.png" alt="Dropillo Logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition ${
                isActive(link.path)
                  ? 'text-[#575B91] font-semibold'
                  : 'text-gray-700 hover:text-[#575B91]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop User Icon with Dropdown */}
        <div className="relative hidden lg:block">
          <button
            onClick={toggleDropdown}
            className="text-2xl text-[#575B91] focus:outline-none"
          >
            <FaUserCircle />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded py-2 w-40">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile User Icon Toggle */}
        <div className="lg:hidden relative">
          <button onClick={toggleMenu} className="text-2xl text-[#575B91] focus:outline-none">
            <FaUserCircle />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={toggleMenu}
              className={`block transition ${
                isActive(link.path)
                  ? 'text-[#575B91] font-semibold'
                  : 'text-gray-700 hover:text-[#575B91]'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="block w-full text-left text-red-600 hover:bg-gray-100 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
