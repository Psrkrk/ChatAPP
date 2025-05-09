import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/authSlice";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiLoader, FiArrowRight } from "react-icons/fi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) return;
  
    try {
      // Dispatch the login action and get the user data
      const user = await dispatch(loginUser({ email, password })).unwrap();
  
      // Store email and token in localStorage
      if (user && user.email && user.token) {
        localStorage.setItem("email", user.email);
        localStorage.setItem("authToken", user.token);  // Store token in localStorage
      } else {
        console.error("User data is incomplete. Cannot store email or token.");
      }
  
      // Redirect to chat page after successful login
      navigate("/chat");
  
    } catch (err) {
      // Handle errors during login
      console.error("Login failed:", err);
      // Optionally, show a message to the user
      toast.error("Login failed. Please try again.");
    }
  };
  
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div 
            className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className={`flex items-center px-4 py-3 border rounded-xl transition-all duration-200 ${
              isFocused.email ? "border-indigo-500 shadow-sm shadow-indigo-100" : "border-gray-200"
            }`}>
              <FiMail className={`text-lg ${isFocused.email ? "text-indigo-500" : "text-gray-400"}`} />
              <input
                type="email"
                placeholder="Email address"
                className="w-full ml-3 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused({...isFocused, email: true})}
                onBlur={() => setIsFocused({...isFocused, email: false})}
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className={`flex items-center px-4 py-3 border rounded-xl transition-all duration-200 ${
              isFocused.password ? "border-indigo-500 shadow-sm shadow-indigo-100" : "border-gray-200"
            }`}>
              <FiLock className={`text-lg ${isFocused.password ? "text-indigo-500" : "text-gray-400"}`} />
              <input
                type="password"
                placeholder="Password"
                className="w-full ml-3 outline-none bg-transparent text-gray-700 placeholder-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused({...isFocused, password: true})}
                onBlur={() => setIsFocused({...isFocused, password: false})}
                required
              />
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Forgot password?
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md"
              }`}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Continue <FiArrowRight className="ml-2" />
                </>
              )}
            </button>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </motion.div>
          )}
        </form>

        <motion.div
          className="mt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Don't have an account?{" "}
          <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign up
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;