import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiImage, FiSave, FiX } from "react-icons/fi";

const UserCard = ({ user, onUpdate, onCancel }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  const [fullname, setFullname] = useState(user.fullname || "");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(user.profileImage || "");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one field is provided or changed
    if (!fullname && !profileImage && previewImage === user.profileImage) {
      toast.error("Please update at least one field.");
      return;
    }

    const formData = new FormData();
    if (fullname && fullname !== user.fullname) {
      formData.append("fullname", fullname);
    }
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      // Dispatch updateProfile with user ID and FormData
      const updatedUser = await dispatch(
        updateProfile({ userId: user._id, formData })
      ).unwrap();

      // Call onUpdate with the updated user data
      onUpdate(updatedUser || { ...user, fullname, profileImage: previewImage });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset state and call onCancel
    setFullname(user.fullname || "");
    setProfileImage(null);
    setPreviewImage(user.profileImage || "");
    onCancel();
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <FiUser className="mr-2" size={18} />
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="fullname"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <FiUser className="mr-2" size={16} />
            Full Name
          </label>
          <input
            id="fullname"
            type="text"
            name="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            placeholder="Enter full name"
            aria-required="false"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <FiMail className="mr-2" size={16} />
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            aria-disabled="true"
          />
        </div>
        <div>
          <label
            htmlFor="profileImage"
            className="flex items-center text-sm font-medium text-gray-700 mb-1"
          >
            <FiImage className="mr-2" size={16} />
            Profile Image
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            aria-label="Upload profile image"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile preview"
              className="mt-3 w-20 h-20 rounded-full object-cover border border-gray-200"
            />
          )}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            aria-label="Cancel editing"
          >
            <FiX className="mr-2" size={14} />
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Save profile changes"
          >
            <FiSave className="mr-2" size={14} />
            {isLoading ? "Updating..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserCard;