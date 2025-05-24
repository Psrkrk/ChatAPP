// // src/pages/User/UserCard.jsx
// import React, { useState, useRef, useEffect, useCallback } from "react";
// import { HiDotsVertical } from "react-icons/hi";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { updateProfile, setUserProfile } from "../../redux/userSlice";

// const UserCard = ({
//   currentUser,
//   previewImage,
//   setPreviewImage,
//   editData,
//   setEditData,
//   showEdit,
//   setShowEdit,
//   showNotification,
// }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [showOptions, setShowOptions] = useState(false);
//   const optionsRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (optionsRef.current && !optionsRef.current.contains(event.target)) {
//         setShowOptions(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleImageChange = useCallback(
//     (e) => {
//       const file = e.target.files[0];
//       if (!file) return;

//       if (!file.type.match("image.*")) {
//         showNotification("Please select an image file", "error");
//         return;
//       }

//       if (file.size > 2 * 1024 * 1024) {
//         showNotification("Image size should be less than 2MB", "error");
//         return;
//       }

//       setEditData((d) => ({ ...d, profileImage: file }));
//       setPreviewImage(URL.createObjectURL(file));
//     },
//     [setEditData, setPreviewImage, showNotification]
//   );

//   const handleCancel = useCallback(() => {
//     setShowEdit(false);
//     setEditData({
//       fullname: currentUser?.fullname || "",
//       profileImage: null,
//     });
//     setPreviewImage(currentUser?.profileImage || "/default-user.png");
//     showNotification("Edit cancelled", "info");
//   }, [currentUser, setEditData, setPreviewImage, showNotification, setShowEdit]);

//   const handleUpdate = useCallback(
//     async (e) => {
//       e.preventDefault();
//       try {
//         const formData = new FormData();
//         formData.append("fullname", editData.fullname);
//         if (editData.profileImage) {
//           formData.append("profileImage", editData.profileImage);
//         }

//         const updated = await dispatch(updateProfile(formData)).unwrap();
//         dispatch(setUserProfile(updated));
//         setShowEdit(false);
//         showNotification("Profile updated successfully!", "success");
//       } catch {
//         showNotification("Failed to update profile", "error");
//       }
//     },
//     [dispatch, editData, showNotification, setShowEdit]
//   );

//   if (!currentUser) return null;

//   return (
//     <>
//       {/* Profile View Mode */}
//       {!showEdit && (
//         <div
//           onClick={() => {
//             navigate(`/chats/${currentUser._id}/received`);
//             setShowEdit(false);
//             setShowOptions(false);
//           }}
//           className="p-4 border-t border-gray-200 bg-gray-50 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
//         >
//           <img
//             src={previewImage}
//             alt={currentUser.fullname}
//             onError={(e) => {
//               if (e.target.src !== "/default-user.png") {
//                 e.target.src = "/default-user.png";
//               }
//             }}
//             className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
//           />
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-medium text-gray-800 truncate">
//               {currentUser.fullname}
//             </p>
//             <p className="text-xs text-gray-500">Your Profile</p>
//           </div>
//           <div className="relative" ref={optionsRef}>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowOptions((v) => !v);
//               }}
//               className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
//               aria-label="Open profile menu"
//             >
//               <HiDotsVertical className="w-5 h-5" />
//             </button>
//             {showOptions && (
//               <div className="absolute bottom-full mb-2 right-0 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setShowEdit(true);
//                     setShowOptions(false);
//                     navigate(`/chats/${currentUser._id}/received`);
//                   }}
//                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white transition-colors"
//                 >
//                   Edit Profile
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Edit Mode */}
//       {showEdit && (
//         <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-md mt-10">
//           <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
//           <form onSubmit={handleUpdate} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Name
//               </label>
//               <input
//                 type="text"
//                 value={editData.fullname || ""}
//                 onChange={(e) =>
//                   setEditData((d) => ({ ...d, fullname: e.target.value }))
//                 }
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Profile Image
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="block"
//                 aria-label="Choose profile image"
//               />
//               {previewImage && (
//                 <img
//                   src={previewImage}
//                   alt="Preview"
//                   className="mt-2 w-24 h-24 object-cover rounded-full border border-gray-300"
//                 />
//               )}
//             </div>
//             <div className="flex gap-3 justify-end">
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
//               >
//                 Update
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserCard;
