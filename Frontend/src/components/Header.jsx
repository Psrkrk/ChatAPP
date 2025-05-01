import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaUserPlus, FaSignInAlt, FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Navigation links
const routes = [
  { name: "Home", href: "/", isActive: true },
  { name: "Services", href: "/services", isActive: false },
  { name: "Features", href: "/features", isActive: false },
  { name: "Connect", href: "/chat", isActive: false },
  { name: "How It Works", href: "#how-it-works", isActive: false },
];

// Navigation list component
const NavMenu = ({ routes, onClick }) => (
  <>
    {routes.map((route, i) => (
      <li key={i} onClick={onClick}>
        <a
          href={route.href}
          className={`px-4 py-2 block transition-opacity duration-200 ${
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
  onClick: PropTypes.func,
};

// Auth buttons (shown when logged out)
const AuthNavMenu = ({ onClick }) => (
  <div className="flex items-center gap-4">
    <li onClick={onClick}>
      <Link
        to="/signup"
        className="flex items-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-1.5 px-4 rounded-lg transition-colors duration-200"
      >
        <FaUserPlus className="text-sm" />
        <span>Sign Up</span>
      </Link>
    </li>
    <li onClick={onClick}>
      <Link
        to="/login"
        className="flex items-center gap-2 border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 py-1.5 px-4 rounded-lg transition-colors duration-200"
      >
        <FaSignInAlt className="text-sm" />
        <span>Log In</span>
      </Link>
    </li>
  </div>
);

AuthNavMenu.propTypes = {
  onClick: PropTypes.func,
};

// User profile dropdown (shown when logged in)
const UserProfileDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
    navigate("/");
    toast.success("Logged out successfully");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle className="text-blue-600 text-2xl" />
          )}
        </div>
        <span className="hidden md:inline font-medium text-gray-700">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            My Profile
          </Link>
          <Link
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          >
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
          >
            <FaSignOutAlt />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

UserProfileDropdown.propTypes = {
  user: PropTypes.object.isRequired,
  onLogout: PropTypes.func.isRequired,
};

// Final header component
const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
  });

  // Check auth status on component mount
  useEffect(() => {
    // Replace with actual auth check
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Fetch user data here in a real app
    }
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    // Perform logout actions
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-white shadow-sm w-full fixed top-0 z-50">
      <nav className="w-full max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_AWvFgBogxUB_kzZQpsNfytDOQXWiN31kFg&s"
              alt="Messenger Logo"
              className="h-9 w-9 rounded-full"
            />
            <span className="font-bold text-lg text-blue-600">Messenger</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <ul className="flex gap-6 items-center">
              <NavMenu routes={routes} />
            </ul>
            
            {isLoggedIn ? (
              <UserProfileDropdown user={user} onLogout={handleLogout} />
            ) : (
              <AuthNavMenu />
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="block lg:hidden text-2xl text-gray-700 p-1"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-white p-4 shadow-lg rounded-lg">
            <ul className="flex flex-col gap-3">
              <NavMenu routes={routes} onClick={closeMenu} />
              <div className="border-t border-gray-100 pt-3 mt-2">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600"
                      >
                        <FaUserCircle />
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMenu();
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 w-full text-left"
                      >
                        <FaSignOutAlt />
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <AuthNavMenu onClick={closeMenu} />
                )}
              </div>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;