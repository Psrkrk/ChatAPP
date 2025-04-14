import React from "react";
import PropTypes from "prop-types";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

// Navigation links
const routes = [
  { name: "Home", href: "/", isActive: true },
  { name: "Services", href: "/services", isActive: false },
  { name: "Features", href: "/features", isActive: false },
  { name: "Connect", href: "/chat", isActive: false },
  { name: "How It Works", href: "#how-it-works", isActive: false },
];

// Navigation list component
const NavMenu = ({ routes }) => (
  <>
    {routes.map((route, i) => (
      <li key={i}>
        <a
          href={route.href}
          className={`px-4 py-2 transition-opacity duration-200 ${
            route.isActive
              ? "text-blue-600 font-semibold"
              : "text-gray-700 hover:text-blue-500"
          }`}
        >
          {route.name}
        </a>
      </li>
    ))}
  </>
);

NavMenu.propTypes = {
  routes: PropTypes.array.isRequired,
};

// Auth buttons
const AuthNavMenu = () => (
  <>
    <li>
      <Link
        to="/signup"
        className="flex items-center gap-1 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-1.5 px-4 rounded transition-colors"
      >
        <FaUserPlus />
        Sign Up
      </Link>
    </li>
    <li>
      <Link
        to="/login"
        className="flex items-center gap-1 border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 py-1.5 px-4 rounded transition-colors"
      >
        <FaSignInAlt />
        Log In
      </Link>
    </li>
  </>
);

// Final header component
const Header = () => {
  return (
    <header className="bg-white shadow-sm w-full fixed top-0 z-50">
      <nav className="w-full max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_AWvFgBogxUB_kzZQpsNfytDOQXWiN31kFg&s"
              alt="Messenger Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="font-bold text-lg text-blue-600">Messenger</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex gap-6 items-center" id="navbar">
            <NavMenu routes={routes} />
            <AuthNavMenu />
          </ul>

          {/* Mobile Hamburger - functionality to be added later */}
          <button
            className="block lg:hidden cursor-pointer"
            type="button"
            id="hamburger"
          >
            <div className="h-0.5 w-6 bg-black my-1"></div>
            <div className="h-0.5 w-6 bg-black my-1"></div>
            <div className="h-0.5 w-6 bg-black my-1"></div>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
