import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../redux/userSlice';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiUpload, FiSave, FiCamera, FiChevronLeft, FiMoreVertical, FiEdit, FiLogOut } from 'react-icons/fi';

const UserCard = ({ user, onBack }) => {
  const dispatch = useDispatch();
  const [fullname, setFullname] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(user.profileImage || null);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', fullname);
    formData.append('email', email);
    if (image) formData.append('profileImage', image);

    dispatch(updateProfile(formData))
      .unwrap()
      .then(() => {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      })
      .catch((err) => toast.error(err.message || 'Update failed'));
  };

  const handleLogout = () => {
    // Add your logout logic here
    toast.info('Logged out successfully');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full relative">
      {/* Header with back button and menu */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="p-1 rounded-full hover:bg-indigo-100 text-gray-600 hover:text-indigo-700 transition-colors"
        >
          <FiChevronLeft size={20} />
        </button>
        
        <h2 className="text-lg font-semibold text-gray-800">User Profile</h2>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded-full hover:bg-indigo-100 text-gray-600 hover:text-indigo-700 transition-colors"
          >
            <FiMoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <FiEdit className="mr-2" size={16} />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <FiLogOut className="mr-2" size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md">
              {preview ? (
                <img src={preview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-indigo-100 flex items-center justify-center">
                  <FiUser className="text-indigo-400" size={32} />
                </div>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer group-hover:bg-indigo-50 transition-colors">
                <FiCamera className="text-gray-600 group-hover:text-indigo-600" size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {isEditing && (
            <label className="mt-3 text-xs text-gray-500 flex items-center cursor-pointer">
              <FiUpload className="mr-1" size={12} />
              Click to upload new photo
              <input type="file" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>

        {/* Fullname Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <FiUser className="mr-2 text-gray-400" size={14} />
            Full Name
          </label>
          {isEditing ? (
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
              placeholder="Enter full name"
            />
          ) : (
            <p className="px-4 py-2 text-gray-800">{fullname}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <FiMail className="mr-2 text-gray-400" size={14} />
            Email Address
          </label>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
              placeholder="Enter email address"
            />
          ) : (
            <p className="px-4 py-2 text-gray-800">{email}</p>
          )}
        </div>

        {/* Role Badge (read-only) */}
        {user.role && (
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Role</label>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-indigo-100 text-indigo-800'
            }`}>
              {user.role}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing ? (
          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center"
            >
              <FiSave className="mr-2" size={16} />
              Save Changes
            </button>
          </div>
        ) : (
          <div className="pt-4">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full bg-white border border-red-100 text-red-600 px-6 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-all flex items-center justify-center"
            >
              <FiLogOut className="mr-2" size={16} />
              Logout
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserCard;