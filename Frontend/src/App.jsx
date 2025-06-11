import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public Pages
import HomePage from "./pages/user_acesss/HomePage.jsx";
import Signup from "./pages/user_authorization/Signup.jsx";
import Login from "./pages/user_authorization/Login.jsx";
import SendOTP from "./pages/forgot_password/SendOTP.jsx";
import VerifyOTP from "./pages/forgot_password/VerifyOTP.jsx";
import CreateNewPassword from "./pages/forgot_password/CreateNewPassword.jsx";
import Service from "./components/Service.jsx";

// Protected Pages
import ProtectedRoute from "./components/protectedroute/ProtectedRoute.jsx";
import UserList from "./pages/user_connections/UserList.jsx";
import SendChat from "./pages/user_connections/SendChat.jsx";
import ReceivedChat from "./pages/user_connections/ReceivedChat.jsx";
import Dashboard from "./pages/admin_acesss/Dashboard.jsx";
// import BlockedUserList from "./pages/settings/BlockedUserList.jsx";
// import Settings from "./pages/settings/Settings.jsx";
// import BlockedUser from "./pages/settings/BlockedUser.jsx";
// import UnblockedUser from "./pages/settings/UnblockedUser.jsx";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services" element={<Service />} />
        <Route path="/forgot-password" element={<SendOTP />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />

        {/* Protected User Chat Routes */}
        <Route
          path="/chats/*"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:receiverId/send"
          element={
            <ProtectedRoute>
              <SendChat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:receiverId/received"
          element={
            <ProtectedRoute>
              <ReceivedChat />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Future Settings Route Example */}
        {/* <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;
