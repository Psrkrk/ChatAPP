import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from "./pages/user_acesss/HomePage.jsx";
import Signup from "./pages/user_authorization/Signup.jsx";
import Login from "./pages/user_authorization/Login.jsx";
import SendOTP from "./pages/forgot_password/SendOTP.jsx";
import VerifyOTP from "./pages/forgot_password/VerifyOTP.jsx";
import CreateNewPassword from "./pages/forgot_password/CreateNewPassword.jsx";
import ProtectedRoute from "./components/protectedroute/ProtectedRoute.jsx"; // ✅ Make sure it's correctly imported
import UserChat from "./pages/user_connections/UserChat.jsx";
import UserList from "./pages/user_connections/UserList.jsx";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<SendOTP />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />

        {/* Protected Route for User List */}
        <Route 
          path="/chats" 
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          } 
        />

        {/* Dynamic Protected Route for User Chat */}
        <Route 
          path="/chats/:id" 
          element={
            <ProtectedRoute>
              <UserChat />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
