// import React from "react";
// import { useDispatch } from "react-redux";
// import { unblockUserById } from "../../redux/settingSlice";
// import { toast } from "react-toastify";

// const UnblockedUser = ({ userId }) => {
//   const dispatch = useDispatch();

//   const handleUnblock = () => {
//     dispatch(unblockUserById(userId)).then((res) => {
//       if (res.meta.requestStatus === "fulfilled") {
//         toast.success("User unblocked successfully");
//       } else {
//         toast.error("Failed to unblock user");
//       }
//     });
//   };

//   return (
//     <button
//       onClick={handleUnblock}
//       className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//     >
//       Unblock User
//     </button>
//   );
// };

// export default UnblockedUser;
