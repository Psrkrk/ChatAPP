import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from "./pages/User/HomePage.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import UserList from "./components/UserList";
import SendOTP from "./components/forgot_password/SendOTP.jsx";
import VerifyOTP from "./components/forgot_password/VerifyOTP.jsx";
import CreateNewPassword from "./components/forgot_password/CreateNewPassword.jsx";
import ProtectedRoute from "./components/protectedroute/ProtectedRoute.jsx"; // ✅ Make sure it's correctly imported




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

        <Route 
  path="/chat" 
  element={
    <ProtectedRoute>
      <UserList />
    </ProtectedRoute>
  } 
/>
      </Routes>
    </Router>
  );
}

export default App;
