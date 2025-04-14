// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";

// const ProtectedRoute = () => {
//   const { user, isLoading } = useSelector((state) => state.auth); // Destructure isLoading to handle initial state
//   const location = useLocation();

//   // Show toast only when user transitions from authenticated to unauthenticated
//   useEffect(() => {
//     if (!user && !isLoading) {
//       toast.warn("Please login first to access this page", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//     }
//   }, [user, isLoading]);

//   // Check both Redux state and localStorage token
//   const isAuthenticated = user && localStorage.getItem("authToken");

//   // Handle loading state to avoid premature redirection
//   if (isLoading) {
//     return <div className="text-center text-gray-600">Loading...</div>; // Optional loading UI
//   }

//   if (!isAuthenticated) {
//     return (
//       <Navigate
//         to="/login"
//         state={{ from: location }}
//         replace
//       />
//     );
//   }

//   return <Outlet />;
// };

// export default ProtectedRoute;