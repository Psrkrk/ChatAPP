import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, getAllUsers } from "../../redux/userSlice";
import { toast } from "react-toastify";
import {
  FiUser,
  FiImage,
  FiSave,
  FiX,
  FiUpload,
  FiEdit,
  FiMoreVertical,
} from "react-icons/fi";

const UserCard = ({ user = {}, onUpdate, onCancel }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  const [fullname, setFullname] = useState(user.fullname || "");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(user.profileImage || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB.");
        return;
      }
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    document.getElementById("profileImage").click();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    const trimmedFullname = fullname.trim();

    // Check if fullname changed or new image selected
    const isFullnameChanged =
      trimmedFullname && trimmedFullname !== (user.fullname || "").trim();
    const isImageChanged = !!profileImage;

    if (!isFullnameChanged && !isImageChanged) {
      toast.error("No changes detected. Please update name or image.");
      return;
    }

    const formData = new FormData();
    if (isFullnameChanged) {
      formData.append("fullname", trimmedFullname);
    }
    if (isImageChanged) {
      formData.append("profileImage", profileImage);
    }

    try {
      // Update profile
      const updatedUser = await dispatch(updateProfile(formData)).unwrap();

      // Refresh user list after update
      await dispatch(getAllUsers());

      toast.success("Profile updated successfully!");
      onUpdate(updatedUser); // Pass updated user back to parent
    } catch (error) {
      toast.error(error?.message || "Failed to update profile.");
      console.error("updateProfile error:", error);
    }
  };

  const handleCancel = () => {
    setFullname(user.fullname || "");
    setProfileImage(null);
    setPreviewImage(user.profileImage || "");
    onCancel();
  };

  // Disable submit button if no changes or loading
  const isSubmitDisabled =
    isLoading ||
    ((!fullname.trim() || fullname.trim() === (user.fullname || "").trim()) &&
      !profileImage);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FiEdit className="mr-2" size={18} />
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiUser className="mr-2" size={16} />
            Full Name
          </label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Profile Image Upload */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <FiImage className="mr-2" size={16} />
            Profile Image
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={previewImage || "/default-user.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 transition-colors"
                aria-label="Change profile image"
              >
                <FiUpload size={14} />
              </button>
              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <span className="text-sm text-gray-500">
              {profileImage ? "New image selected" : "Click icon to change"}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end items-center space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiX className="mr-2" size={14} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            aria-label="Save changes"
            className="flex items-center p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="text-sm px-2">Saving...</span>
            ) : (
              <FiMoreVertical size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCard;
