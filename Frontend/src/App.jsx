import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import HomePage from "./pages/User/HomePage.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import UserList from "./components/UserList";
import SendOTP from "./components/SendOTP.jsx";
import VerifyOTP from "./components/VerifyOTP.jsx";
import CreateNewPassword from "./components/CreateNewPassword.jsx";
// import ProtectedRoute from "./protectedroute/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      {/* ✅ Toast container here */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/send-otp" element={<SendOTP />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route
          path="/chat"
          element={
            // <ProtectedRoute>
              <UserList />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
