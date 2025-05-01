import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { MoreHorizontal, Search, UserPlus, Upload, User, Shield, Mail, Frown } from "lucide-react";
import { fetchAllUsers, fetchUserProfile, updateProfile, updateProfileImage } from "../redux/userSlice";

const UserList = () => {
  const dispatch = useDispatch();
  const { user: profile, users: allUsers = [], isLoading, error } = useSelector((state) => state.user);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await dispatch(fetchUserProfile()).unwrap();
        setFullname(res.fullname);
        setEmail(res.email);
      } catch (err) {
        toast.error("Failed to fetch profile");
      }
    };
    loadProfile();
  }, [dispatch]);

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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleUpdateInfo = async () => {
    try {
      await dispatch(updateProfile({ fullname, email })).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleUpdateImage = async () => {
    if (!selectedFile) {
      toast.warning("Please select an image first");
      return;
    }
    
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await dispatch(updateProfileImage(formData)).unwrap();
      toast.success("Profile image updated!");
      setSelectedFile(null);
    } catch {
      toast.error("Failed to upload image");
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      (user.fullname || "").toLowerCase().includes(term) ||
      (user.email || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8 relative">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <User className="text-indigo-600" size={24} />
              My Profile
            </h2>
            <p className="text-gray-500">Manage your account information</p>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowActions(!showActions)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MoreHorizontal className="text-gray-500 hover:text-gray-800" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 z-10 overflow-hidden">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>
                <button
                  onClick={handleUpdateImage}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2"
                >
                  <Upload size={16} />
                  Upload Image
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                type="text"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                type="email"
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <button
                onClick={handleUpdateInfo}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                Save Changes
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile?.profileImage ? `http://localhost:5000${profile.profileImage}` : "/default-avatar.png"}
                  alt={fullname}
                  className="h-24 w-24 rounded-full object-cover border-4 border-indigo-100"
                />
                {selectedFile && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs text-center px-2">New Image Selected</span>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="profile-image"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="profile-image"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-2 text-sm"
                >
                  <Upload size={16} />
                  Choose Image
                </label>
                {selectedFile && (
                  <p className="text-xs text-gray-500 mt-1">{selectedFile.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="text-indigo-600" size={24} />
              User Management
            </h2>
            <p className="text-gray-500">View and manage all system users</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Frown className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-700">
              {searchTerm ? "No users found" : "No users available"}
            </h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? "Try a different search term" : "Check back later"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const UserCard = ({ user }) => {
  const [imgSrc, setImgSrc] = useState(() => {
    const filename = user?.profileImage?.trim();
    if (filename && filename !== "/uploads/") {
      return filename.startsWith("/uploads/")
        ? `http://localhost:5000${filename}`
        : `http://localhost:5000/uploads/${filename}`;
    }
    return "/default-avatar.png";
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 flex items-center space-x-4">
        <div className="relative">
          <img
            src={imgSrc}
            alt={user.fullname || "User"}
            className="h-14 w-14 rounded-full object-cover border-2 border-indigo-100"
            onError={() => setImgSrc("/default-avatar.png")}
          />
          {user.isOnline && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {user.fullname || "Unknown User"}
          </p>
          <p className="text-sm text-gray-500 truncate flex items-center gap-1">
            
           
          </p>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
        <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default UserList;