// src/pages/User/UserList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllUsers } from "../../redux/userSlice";
import UserCard from "./UserCard.jsx";
import SendChat from "./SendChat.jsx";
import ReceivedChat from "./ReceivedChat.jsx";
import { HiDotsVertical } from "react-icons/hi";
import Modal from "react-modal";
import Notification from "../../components/Notifications";

Modal.setAppElement("#root");

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const location = useLocation();

  const { users, user: currentUser } = useSelector((state) => state.user);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Fetch all users
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Update selectedUser based on receiverId
  useEffect(() => {
    if (receiverId) {
      const foundUser = users.find((u) => u._id === receiverId);
      setSelectedUser(foundUser || null);
      setShowEdit(false);
    } else {
      setSelectedUser(null);
      setShowEdit(false);
    }
  }, [receiverId, users]);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type });
    }, 3000);
  };

  // Handle user click
  const handleUserClick = (user) => {
    setShowEdit(false);
    navigate(`/chats/${user._id}/send`);
    showNotification(`Now chatting with ${user.fullname}`, "success");
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setShowEdit((prev) => !prev);
  };

  // Handle profile update
  const handleUpdate = (updatedUser) => {
    setSelectedUser(updatedUser);
    setShowEdit(false);
    showNotification("Profile updated successfully!", "success");
  };

  // Cancel editing
  const handleCancel = () => {
    setShowEdit(false);
    showNotification("Edit cancelled", "error");
  };

  // Detect chat mode from path
  const pathSegments = location.pathname.split("/");
  const chatMode = pathSegments[pathSegments.length - 1];

  return (
    <div className="flex h-screen">
      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, show: false })}
        />
      )}

      {/* Sidebar - User list */}
      <div className="w-1/3 bg-gray-100 border-r overflow-y-auto flex flex-col">
        <div className="p-4 border-b bg-white font-semibold text-lg">Users</div>
        <div className="flex-1 overflow-y-auto">
          {users
            .filter((u) => u._id !== currentUser?._id)
            .map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-200 ${
                  selectedUser?._id === user._id ? "bg-gray-200" : ""
                }`}
              >
                <img
                  src={user.profileImage || "/default.png"}
                  alt={user.fullname}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="text-sm font-medium text-gray-800">
                  {user.fullname}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Chat Section / Edit Panel */}
      <div className="w-2/3 relative flex flex-col">
        {/* 3-dot menu (Edit toggle) */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleEditClick}
            aria-label={showEdit ? "Cancel edit profile" : "Edit profile"}
            className="p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <HiDotsVertical className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {showEdit ? (
          <div className="p-4 overflow-auto">
            <UserCard
              user={currentUser}
              onUpdate={handleUpdate}
              onCancel={handleCancel}
            />
          </div>
        ) : selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 flex items-center gap-3 bg-white border-b">
              <img
                src={selectedUser.profileImage || "/default.png"}
                alt={selectedUser.fullname}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <h3 className="text-base font-semibold text-gray-800">
                  {selectedUser.fullname}
                </h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-grow overflow-y-auto p-4">
              {chatMode === "send" && (
                <SendChat
                  receiverId={receiverId}
                  selectedUser={selectedUser}
                />
              )}
              {chatMode === "received" && (
                <ReceivedChat
                  receiverId={receiverId}
                  selectedUser={selectedUser}
                />
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
