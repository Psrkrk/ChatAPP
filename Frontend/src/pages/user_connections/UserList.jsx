// src/pages/User/UserList.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllUsers, setUserProfile, updateProfile } from "../../redux/userSlice";
import SendChat from "./SendChat.jsx";
import ReceivedChat from "./ReceivedChat.jsx";
import { HiDotsVertical, HiOutlinePencilAlt, HiOutlineX } from "react-icons/hi";
import { FiSend, FiInbox } from "react-icons/fi";
import Modal from "react-modal";
import Notification from "../../components/Notifications";

Modal.setAppElement("#root");

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const location = useLocation();

  const { users, user: currentUser, isLoading } = useSelector((state) => state.user);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [editData, setEditData] = useState({
    fullname: currentUser?.fullname || "",
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(currentUser?.profileImage || "/default-user.png");

  // For dropdown menu toggle
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);

  // Fetch all users on mount
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // When URL changes, select the appropriate user
  useEffect(() => {
    if (receiverId) {
      const found = users.find((u) => u._id === receiverId);
      setSelectedUser(found || null);
      setShowEdit(false);
      setShowOptions(false); // close options when user changes
    } else {
      setSelectedUser(null);
      setShowEdit(false);
      setShowOptions(false);
    }
  }, [receiverId, users]);

  // When currentUser changes (e.g. on login), reset edit form
  useEffect(() => {
    if (currentUser) {
      setEditData({ fullname: currentUser.fullname, profileImage: null });
      setPreviewImage(currentUser.profileImage || "/default-user.png");
    }
  }, [currentUser]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showNotification = useCallback((msg, type = "success") => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type });
    }, 3000);
  }, []);

  const handleUserClick = useCallback(
    (user) => {
      if (isLoading) return;
      setShowEdit(false);
      setShowOptions(false);
      navigate(`/chats/${user._id}/send`);
      showNotification(`Now chatting with ${user.fullname}`, "success");
    },
    [isLoading, navigate, showNotification]
  );

  const handleEditClick = useCallback(() => {
    if (isLoading) return;
    setShowEdit((prev) => !prev);
    setShowOptions(false); // close dropdown when editing
  }, [isLoading]);

  const handleCancel = useCallback(() => {
    setShowEdit(false);
    setEditData({ fullname: currentUser.fullname, profileImage: null });
    setPreviewImage(currentUser.profileImage || "/default-user.png");
    showNotification("Edit cancelled", "info");
  }, [currentUser, showNotification]);

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate image type and size
      if (!file.type.match("image.*")) {
        showNotification("Please select an image file", "error");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        // 2MB
        showNotification("Image size should be less than 2MB", "error");
        return;
      }

      setEditData((d) => ({ ...d, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    },
    [showNotification]
  );

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        formData.append("fullname", editData.fullname);
        if (editData.profileImage) {
          formData.append("profileImage", editData.profileImage);
        }

        const updated = await dispatch(updateProfile(formData)).unwrap();
        dispatch(setUserProfile(updated));
        setSelectedUser(updated);
        setShowEdit(false);
        showNotification("Profile updated successfully!", "success");
      } catch {
        showNotification("Failed to update profile", "error");
      }
    },
    [dispatch, editData, showNotification]
  );

  const pathSegments = location.pathname.split("/");
  const chatMode = pathSegments[pathSegments.length - 1];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification((n) => ({ ...n, show: false }))}
        />
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => navigate("/chats")}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium ${
              !receiverId
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiInbox className="w-4 h-4" />
            All Chats
          </button>
          <button
            onClick={() =>
              currentUser && navigate(`/chats/${currentUser._id}/received`)
            }
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-medium ${
              selectedUser?._id === currentUser?._id
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiSend className="w-4 h-4" />
            My Messages
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users
            .filter((u) => u._id !== currentUser?._id)
            .map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  selectedUser?._id === user._id ? "bg-indigo-50" : "hover:bg-gray-50"
                } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="relative">
                  <img
                    src={user.profileImage || "/default-user.png"}
                    alt={user.fullname}
                    onError={(e) => {
                      e.target.src = "/default-user.png";
                    }}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                  />
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {user.fullname}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* Current User Profile */}
        {currentUser && (
          <div
            onClick={() => {
              navigate(`/chats/${currentUser._id}/received`);
              setShowEdit(false);
              setShowOptions(false);
            }}
            className="p-4 border-t border-gray-200 bg-gray-50 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <img
              src={previewImage}
              alt={currentUser.fullname}
              onError={(e) => (e.target.src = "/default-user.png")}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {currentUser.fullname}
              </p>
              <p className="text-xs text-gray-500">Your Profile</p>
            </div>
            {/* 3-dot menu */}
            <div className="relative" ref={optionsRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent sidebar click
                  setShowOptions((v) => !v);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Open profile menu"
              >
                <HiDotsVertical className="w-5 h-5" />
              </button>
              {showOptions && (
                <div className="absolute bottom-full mb-2 right-0 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEdit(true);
                      setShowOptions(false);
                      navigate(`/chats/${currentUser._id}/received`);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    Edit Profile
                  </button>
                  {/* Add more options here if you want */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {selectedUser && !showEdit && (
          <>
            {/* Header */}
            <header className="border-b border-gray-200 p-4 flex items-center gap-4 bg-white shadow-sm">
              <img
                src={selectedUser.profileImage || "/default-user.png"}
                alt={selectedUser.fullname}
                onError={(e) => (e.target.src = "/default-user.png")}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
              />
              <div>
                <h2 className="text-lg font-semibold">{selectedUser.fullname}</h2>
                <p className="text-sm text-gray-500">
                  {selectedUser.isOnline ? "Online" : "Offline"}
                </p>
              </div>
            </header>

            {/* Chat content */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              {chatMode === "send" && <SendChat receiverId={selectedUser._id} />}
              {chatMode === "received" && <ReceivedChat receiverId={selectedUser._id} />}
            </div>
          </>
        )}

        {/* Edit Profile Form */}
        {showEdit && currentUser && (
          <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-md mt-10">
            <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editData.fullname}
                  onChange={(e) =>
                    setEditData((d) => ({ ...d, fullname: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-full border border-gray-300"
                  />
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Default message if no user selected */}
        {!selectedUser && !showEdit && (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
            Select a user to start chatting.
          </div>
        )}
      </main>
    </div>
  );
};

export default UserList;
