// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { updateProfile } from "../../redux/userSlice";
// import { toast } from "react-toastify";

// const UserCard = ({ user = {}, onUpdate, onCancel }) => {
//   const dispatch = useDispatch();
//   const { isLoading } = useSelector((state) => state.user);

//   const [fullname, setFullname] = useState(user.fullname || "");
//   const [profileImage, setProfileImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(user.profileImage || "/default-user.png");

//   // Prevent unnecessary resets and flickers
//   useEffect(() => {
//     setFullname((prev) => {
//       return prev !== (user.fullname || "") ? user.fullname || "" : prev;
//     });

//     setPreviewImage((prev) => {
//       return prev !== (user.profileImage || "/default-user.png")
//         ? user.profileImage || "/default-user.png"
//         : prev;
//     });

//     setProfileImage(null);
//   }, [user.fullname, user.profileImage]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file (JPEG, PNG, etc.)");
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error("Image size must be less than 2MB");
//       return;
//     }

//     setProfileImage(file);
//     setPreviewImage(URL.createObjectURL(file));
//   };

//   const triggerFileInput = () => {
//     document.getElementById("profileImage").click();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const trimmedFullname = fullname.trim();
//     const isFullnameChanged = trimmedFullname !== (user.fullname || "").trim();
//     const isImageChanged = !!profileImage;

//     if (!isFullnameChanged && !isImageChanged) {
//       toast.info("No changes detected");
//       return;
//     }

//     const formData = new FormData();
//     if (isFullnameChanged) formData.append("fullname", trimmedFullname);
//     if (isImageChanged) formData.append("profileImage", profileImage);

//     try {
//       const resultAction = await dispatch(updateProfile(formData));
//       const updatedUser = resultAction.payload;

//       toast.success("Profile updated successfully");
//       onUpdate?.(updatedUser);
//     } catch (error) {
//       toast.error(error.message || "Failed to update profile");
//       console.error("Update error:", error);
//     }
//   };

//   const handleCancel = () => {
//     setFullname(user.fullname || "");
//     setProfileImage(null);
//     setPreviewImage(user.profileImage || "/default-user.png");
//     onCancel?.();
//   };

//   const isSubmitDisabled =
//     isLoading ||
//     (fullname.trim() === (user.fullname || "").trim() && !profileImage);

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200">
//       <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Full Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Full Name
//           </label>
//           <input
//             type="text"
//             value={fullname}
//             onChange={(e) => setFullname(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
//             placeholder="Enter your name"
//             minLength="2"
//             maxLength="50"
//           />
//         </div>

//         {/* Profile Image Upload */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Profile Image
//           </label>
//           <div className="flex items-center gap-4">
//             <img
//               src={previewImage}
//               alt="Profile preview"
//               className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 transition-all"
//               onError={(e) => {
//                 e.target.src = "/default-user.png";
//               }}
//             />
//             <div>
//               <button
//                 type="button"
//                 onClick={triggerFileInput}
//                 className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
//               >
//                 Change Image
//               </button>
//               <input
//                 id="profileImage"
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </div>
//           </div>
//           <p className="text-xs text-gray-500 mt-1">
//             Max 2MB (JPEG, PNG, etc.)
//           </p>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end items-center space-x-3 pt-4">
//           <button
//             type="button"
//             onClick={handleCancel}
//             disabled={isLoading}
//             className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             disabled={isSubmitDisabled}
//             className="px-4 py-2 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             {isLoading ? (
//               <span className="flex items-center">
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Saving...
//               </span>
//             ) : (
//               "Save Changes"
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UserCard;
