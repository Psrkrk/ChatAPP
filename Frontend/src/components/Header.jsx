import React, { useState, useEffect, useRef } from "react";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaTrashAlt,
  FaEllipsisV,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../redux/userSlice";
import { toast } from "react-toastify";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Services", href: "/services" },
];

const getNameFromEmail = (email) => {
  if (!email) return "User";
  return email.split("@")[0].replace(/[._]/g, " ");
};

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const { users } = useSelector((state) => state.user);
  const token = localStorage.getItem("authToken");
  const email = localStorage.getItem("email");

  const loggedInUser = users.find((u) => u.email === email);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (token && email) {
      setIsLoggedIn(true);
      dispatch(getAllUsers());
    }
  }, [dispatch, token, email]);

  const toggleMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setMobileMenuOpen(false);

  const toggleUserMenu = () => setUserMenuOpen(!isUserMenuOpen);

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await dispatch(deleteUser()).unwrap();
        localStorage.removeItem("authToken");
        localStorage.removeItem("email");
        setIsLoggedIn(false);
        setUserMenuOpen(false);
        toast.success("Account deleted successfully");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete account");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUserMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleConnectClick = () => {
    isLoggedIn ? navigate("/chats") : navigate("/login");
    closeMenu();
  };

  return (
    <header className="bg-white shadow-sm w-full fixed top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3">
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
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-700 hover:text-blue-600">
                    {link.name}
                  </a>
                </li>
              ))}
              <li
                onClick={handleConnectClick}
                className="cursor-pointer text-gray-700 hover:text-blue-600"
              >
                Connect
              </li>
            </ul>

            {/* User Info */}
            {isLoggedIn && loggedInUser ? (
              <div className="flex items-center gap-4 relative" ref={userMenuRef}>
                <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden">
                  {loggedInUser.avatar ? (
                    <img
                      src={loggedInUser.avatar}
                      alt={loggedInUser.fullname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-blue-600 text-2xl mx-auto mt-2" />
                  )}
                </div>
                <span className="hidden md:inline font-medium text-gray-700">
                  {loggedInUser.fullname || getNameFromEmail(loggedInUser.email)}
                </span>
                <button
                  onClick={toggleUserMenu}
                  className="text-gray-700 hover:text-blue-600"
                  aria-label="User Menu"
                >
                  <FaEllipsisV />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg p-2 w-48 z-50">
                    <ul className="flex flex-col gap-2">
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full text-left"
                        >
                          <FaSignOutAlt /> Logout
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleDeleteAccount}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800 w-full text-left"
                        >
                          <FaTrashAlt /> Delete Account
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/signup" className="text-blue-600">
                  Sign Up
                </Link>
                <Link to="/login" className="text-blue-600">
                  Log In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="block lg:hidden text-2xl text-gray-700"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 bg-white p-4 shadow-lg rounded-lg">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} onClick={closeMenu} className="text-gray-700">
                    {link.name}
                  </a>
                </li>
              ))}
              <li onClick={handleConnectClick} className="text-gray-700 cursor-pointer">
                Connect
              </li>
              <div className="border-t border-gray-200 pt-3">
                {isLoggedIn ? (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden">
                        {loggedInUser.avatar ? (
                          <img
                            src={loggedInUser.avatar}
                            alt={loggedInUser.fullname}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="text-blue-600 text-xl mx-auto mt-1" />
                        )}
                      </div>
                      <span className="font-medium text-gray-700">
                        {loggedInUser.fullname || getNameFromEmail(loggedInUser.email)}
                      </span>
                      <button
                        onClick={toggleUserMenu}
                        className="ml-auto text-gray-700 hover:text-blue-600"
                        aria-label="User Menu"
                      >
                        <FaEllipsisV />
                      </button>
                    </li>
                    {isUserMenuOpen && (
                      <ul className="flex flex-col gap-2 pl-4">
                        <li>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 w-full text-left"
                          >
                            <FaSignOutAlt /> Logout
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={handleDeleteAccount}
                            className="flex items-center gap-2 text-red-600 w-full text-left"
                          >
                            <FaTrashAlt /> Delete Account
                          </button>
                        </li>
                      </ul>
                    )}
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/signup" onClick={closeMenu} className="text-gray-700">
                        Sign Up
                      </Link>
                    </li>
                    <li>
                      <Link to="/login" onClick={closeMenu} className="text-gray-700">
                        Log In
                      </Link>
                    </li>
                  </>
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
