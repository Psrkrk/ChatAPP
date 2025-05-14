import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.payload);
  const isLoading = useSelector((state) => state.auth.isLoading); // Optional: add loading flag in your auth slice

  const localToken = localStorage.getItem("authToken");

  // Show loading state or fallback while Redux initializes
  if (isLoading) return <div>Loading...</div>;

  if (!token && !localToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
