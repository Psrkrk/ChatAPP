import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, updateProfile, updateProfileImage } from "../redux/userSlice";
import { toast } from "react-toastify";

const UserList = () => {
  const dispatch = useDispatch();
  const { users: allUsers = [], isLoading, error } = useSelector((state) => state.user);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editForm, setEditForm] = useState({ fullname: "", email: "", profileImage: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        await dispatch(fetchAllUsers()).unwrap();
      } catch (err) {
        toast.error(`Failed to load users: ${err.message}`);
      }
    };
    loadUsers();
  }, [dispatch]);

  // Handle error state
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Filter users based on search term
  const filteredUsers = allUsers.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.fullname || "").toLowerCase().includes(term) ||
      (user.email || "").toLowerCase().includes(term)
    );
  });

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setEditForm({
      fullname: user.fullname || "",
      email: user.email || "",
      profileImage: user.profileImage || ""
    });
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error('Image size should be less than 2MB');
        return;
      }

      setSelectedImage(file);
      setEditForm((prev) => ({
        ...prev,
        profileImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editForm.fullname && !editForm.email && !selectedImage) {
      toast.warn('No changes detected');
      return;
    }

    setIsUpdating(true);
    try {
      // Update basic info if changed
      if (editForm.fullname || editForm.email) {
        await dispatch(updateProfile({
          userId: editingUserId,
          data: {
            fullname: editForm.fullname,
            email: editForm.email
          }
        })).unwrap();
        toast.success('Profile updated successfully');
      }

      // Upload new image if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        await dispatch(updateProfileImage({
          userId: editingUserId,
          formData
        })).unwrap();
        toast.success('Profile image updated successfully');
      }

      // Refresh user list
      await dispatch(fetchAllUsers()).unwrap();
      
      // Reset form
      setEditingUserId(null);
      setSelectedImage(null);
      setEditForm({ fullname: "", email: "", profileImage: "" });
    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setSelectedImage(null);
    setEditForm({ fullname: "", email: "", profileImage: "" });
  };

  // Function to get proper image URL
  const getImageUrl = (user) => {
    if (editingUserId === user._id && editForm.profileImage) {
      return editForm.profileImage;
    }
    if (user.profileImage) {
      // Check if it's already a full URL or needs the base URL
      return user.profileImage.startsWith('http') 
        ? user.profileImage 
        : `'http://localhost:5000'}${user.profileImage}`;
    }
    return "/default-avatar.png";
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {isLoading && !isUpdating ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center space-x-4 p-5 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-200"
            >
              <div className="relative">
                <img
                  src={getImageUrl(user)}
                  alt={user.fullname || "User"}
                  className="h-16 w-16 rounded-full object-cover border-2 border-indigo-100"
                  onError={(e) => { e.target.src = "/default-avatar.png"; }}
                />
                {editingUserId === user._id ? (
                  <div className="absolute top-0 right-0 mt-1 mr-1">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                      id={`image-upload-${user._id}`}
                      accept="image/*"
                    />
                    <label htmlFor={`image-upload-${user._id}`} className="text-indigo-600 text-xs cursor-pointer hover:text-indigo-800">
                      Edit Image
                    </label>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick(user)}
                    className="absolute top-0 right-0 mt-1 mr-1 text-indigo-600 text-xs hover:text-indigo-800"
                  >
                    Edit
                  </button>
                )}
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                {editingUserId === user._id ? (
                  <form onSubmit={handleSave} className="space-y-2">
                    <input
                      type="text"
                      name="fullname"
                      value={editForm.fullname}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      placeholder="Full Name"
                      required
                      minLength="2"
                    />
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      placeholder="Email"
                      required
                    />
                    <div className="flex gap-2">
                      <button 
                        type="submit" 
                        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                      <button 
                        type="button" 
                        onClick={handleCancel} 
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="font-semibold text-gray-900 text-lg truncate">{user.fullname || "Unknown User"}</p>
                    <p className="text-gray-600 text-sm truncate">{user.email || "No email provided"}</p>
                    <p className="text-indigo-600 text-xs mt-1">{user.userRole || "Member"}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <p className="mt-4 text-gray-500">
            {searchTerm ? "No matching users found" : "No users available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserList;