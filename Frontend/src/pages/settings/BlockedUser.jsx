// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { blockUserById } from "../../redux/settingSlice"; // Import the action to fetch blocked users

// const BlockedUser = () => {
//   const dispatch = useDispatch();

//   const { blockedUsers, loading, error } = useSelector(
//     (state) => state.settings
//   );

//   // Fetch blocked users on mount
//   useEffect(() => {
//     dispatch(fetchBlockedUsers());
//   }, [dispatch]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-bold mb-4">Blocked Users</h2>
//       {blockedUsers.length === 0 ? (
//         <p>No users have been blocked yet.</p>
//       ) : (
//         <ul>
//           {blockedUsers.map((user) => (
//             <li key={user._id} className="flex justify-between items-center mb-2">
//               <span>{user.fullname || "Unknown User"}</span>
//               <span className="text-sm text-gray-500">{user.email}</span>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default BlockedUser;
