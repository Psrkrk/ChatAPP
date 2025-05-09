import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../redux/userSlice";
import { FiUsers, FiUser, FiMail, FiChevronRight, FiAlertCircle } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import UserCard from "./UserCard";

const UserList = () => {
  const dispatch = useDispatch();
  const { users, isLoading, error } = useSelector((state) => state.user);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users initially
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Sync selectedUser if updated in Redux
  useEffect(() => {
    if (selectedUser) {
      const updatedUser = users.find((u) => u._id === selectedUser._id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    }
  }, [users, selectedUser]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 rounded-lg p-4 flex items-start border border-red-100">
          <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error loading users</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
      {/* User List Section */}
      <div className="w-full md:w-1/3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center">
              <FiUsers className="text-indigo-600 mr-2" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">User Directory</h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {users.length} {users.length === 1 ? "user" : "users"} in system
            </p>
          </div>

          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500 flex flex-col items-center">
              <FiUser className="text-gray-300 mb-2" size={24} />
              <p>No users found</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {users.map((user) => (
                <li
                  key={user._id}
                  className={`px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedUser?._id === user._id ? "bg-indigo-50" : ""
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.fullname}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FiUser className="text-indigo-600" size={18} />
                          </div>
                        )}
                        {selectedUser?._id === user._id && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-indigo-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">{user.fullname}</h3>
                        <p className="text-xs text-gray-500 flex items-center">
                          <FiMail className="mr-1" size={12} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {user.role || "user"}
                      </span>
                      <FiChevronRight className="ml-2 text-gray-400" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* User Details Section */}
      <div className="w-full md:w-2/3">
        {selectedUser ? (
          <UserCard user={selectedUser} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-white rounded-xl shadow-sm border border-gray-100 border-dashed">
            <FiUser className="text-gray-300 mb-3" size={32} />
            <h3 className="text-lg font-medium text-gray-500">Select a user</h3>
            <p className="text-sm text-gray-400 mt-1">Choose from the list to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
