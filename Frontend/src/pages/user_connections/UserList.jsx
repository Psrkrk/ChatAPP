import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllUsers, updateProfile } from "../../redux/userSlice";
import SendChat from "./SendChat.jsx";
import ReceivedChat from "./ReceivedChat.jsx";
import { FiSend, FiInbox, FiBell, FiEdit2, FiX, FiMenu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const UserList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const location = useLocation();

  const { users, user: currentUser, isLoading, error } = useSelector(
    (state) => state.user || {}
  );

  const [selectedUser, setSelectedUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    currentUser?.profileImage || "/default-user.png"
  );
  const [editData, setEditData] = useState({
    fullname: currentUser?.fullname || "",
    profileImage: null,
  });
  const [persistentNotifications, setPersistentNotifications] = useState([]);
  const [toastNotifications, setToastNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(API_BASE_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      if (currentUser?._id) {
        newSocket.emit("register", currentUser._id);
      }
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      showToastNotification("Failed to connect to server. Retrying...", "error");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []); // Remove currentUser from dependencies to avoid reinitializing socket

  // Set up socket listeners and fetch notifications
  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    socket.emit("register", currentUser._id);

    socket.on("newMessage", (message) => {
      const notification = {
        _id: Date.now().toString(),
        type: "message",
        sender: message.sender,
        text: `New message from ${message.senderName}`,
        read: false,
        link: `/chats/${message.sender}/received`,
        timestamp: Date.now(),
      };
      addPersistentNotification(notification);
    });

    socket.on("notification", (notification) => {
      addPersistentNotification(notification);
    });

    // Placeholder for fetching initial notifications
    // Replace with actual notificationService implementation
    /*
    notificationService.getNotifications(currentUser._id)
      .then((notifications) => {
        setPersistentNotifications(
          notifications.map((n) => ({
            ...n,
            timestamp: n.createdAt || Date.now(),
          }))
        );
        setUnreadCount(notifications.filter((n) => !n.read).length);
      })
      .catch((err) => showToastNotification(err.message, "error"));
    */

    // Mock initial notifications (replace with actual service call)
    const mockNotifications = [
      {
        _id: "1",
        type: "message",
        sender: "mockUser1",
        text: "New message from Mock User",
        read: false,
        link: `/chats/mockUser1/received`,
        timestamp: Date.now(),
      },
    ];
    setPersistentNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);

    return () => {
      socket.off("newMessage");
      socket.off("notification");
    };
  }, [socket, currentUser?._id]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Fetch users
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  // Update selected user and sync sidebar
  useEffect(() => {
    if (receiverId && currentUser) {
      const user = receiverId === currentUser._id
        ? currentUser
        : users.find((u) => u._id === receiverId) || null;
      setSelectedUser(user);
      setShowSidebar(false); // Close sidebar on user selection (mobile)
    } else {
      setSelectedUser(null);
    }
  }, [receiverId, users, currentUser]);

  // Sync edit form
  useEffect(() => {
    if (currentUser) {
      setEditData({
        fullname: currentUser.fullname || "",
        profileImage: null,
      });
      setPreviewImage(currentUser.profileImage || "/default-user.png");
    }
  }, [currentUser]);

  const addPersistentNotification = useCallback((notification) => {
    setPersistentNotifications((prev) => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
      showToastNotification(notification.text, "info");
    }
  }, []);

  const showToastNotification = useCallback((message, type = "info") => {
    const toastId = `toast-${Date.now()}`;
    setToastNotifications((prev) => [
      ...prev,
      { id: toastId, message, type, visible: true },
    ]);

    setTimeout(() => {
      setToastNotifications((prev) =>
        prev.map((t) =>
          t.id === toastId ? { ...t, visible: false } : t
        )
      );
    }, 5000);
  }, []);

  const handleUserClick = useCallback(
    (user) => {
      if (isLoading) return;
      setShowEdit(false);
      setShowSidebar(false);
      navigate(`/chats/${user._id}/send`);
      showToastNotification(`Now chatting with ${user.fullname}`, "success");
    },
    [isLoading, navigate]
  );

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.match("image.*")) {
        showToastNotification("Please select an image file", "error");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        showToastNotification("Image size should be less than 2MB", "error");
        return;
      }

      if (previewImage && previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }

      setEditData((d) => ({ ...d, profileImage: file }));
      setPreviewImage(URL.createObjectURL(file));
    },
    [previewImage]
  );

  const handleCancel = useCallback(() => {
    setShowEdit(false);
    setEditData({
      fullname: currentUser?.fullname || "",
      profileImage: null,
    });
    if (previewImage && previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(currentUser?.profileImage || "/default-user.png");
    showToastNotification("Edit cancelled", "info");
  }, [currentUser, previewImage]);

  const handleUpdate = useCallback(
    async (e) => {
      e.preventDefault();

      if (!editData.fullname.trim() && !editData.profileImage) {
        showToastNotification("Please provide a name or image", "warning");
        return;
      }

      try {
        await dispatch(
          updateProfile({
            fullname: editData.fullname.trim(),
            profileImage: editData.profileImage,
          })
        ).unwrap();
        showToastNotification("Profile updated successfully", "success");
        setShowEdit(false);

        if (socket) {
          socket.emit("notification", {
            _id: Date.now().toString(),
            userId: currentUser._id,
            type: "profile",
            text: `${currentUser.fullname} updated their profile`,
            read: false,
            timestamp: Date.now(),
          });
        }
      } catch (err) {
        showToastNotification(err?.message || "Failed to update profile", "error");
      }
    },
    [dispatch, editData, socket, currentUser]
  );

  const markAsRead = useCallback(
    async (id) => {
      try {
        setPersistentNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        showToastNotification("Failed to mark notification as read", "error");
      }
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    try {
      setPersistentNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      showToastNotification("All notifications marked as read", "success");
    } catch (err) {
      showToastNotification("Failed to mark all notifications as read", "error");
    }
  }, []);

  const chatMode = location.pathname.split("/").pop();

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toastNotifications
          .filter((n) => n.visible)
          .map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-4 left-4 right-4 sm:right-4 sm:left-auto p-4 rounded-lg shadow-lg max-w-sm z-50 border-l-4 ${
                notification.type === "success"
                  ? "bg-green-50 border-green-500"
                  : notification.type === "error"
                  ? "bg-red-50 border-red-500"
                  : notification.type === "warning"
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-white border-indigo-500"
              }`}
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start">
                <p className="text-base sm:text-sm font-medium text-gray-800">
                  {notification.message}
                </p>
                <button
                  onClick={() =>
                    setToastNotifications((prev) =>
                      prev.map((t) =>
                        t.id === notification.id ? { ...t, visible: false } : t
                      )
                    )
                  }
                  className="ml-2 text-gray-400 hover:text-gray-600 p-2"
                  aria-label="Close notification"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotificationPanel && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowNotificationPanel(false)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="absolute top-0 right-0 h-full w-full sm:w-80 bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-lg sm:text-xl">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-indigo-600 hover:underline"
                      aria-label="Mark all notifications as read"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotificationPanel(false)}
                    aria-label="Close notification panel"
                    className="p-2"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="overflow-y-auto h-[calc(100%-60px)]">
                {persistentNotifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-base">
                    No notifications yet
                  </div>
                ) : (
                  persistentNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b border-gray-100 active:bg-gray-100 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        if (notification.link) navigate(notification.link);
                        markAsRead(notification._id);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          if (notification.link) navigate(notification.link);
                          markAsRead(notification._id);
                        }
                      }}
                      aria-label={`Notification: ${notification.text}`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`p-2 rounded-full ${
                            notification.type === "message"
                              ? "bg-purple-100 text-purple-600"
                              : "bg-indigo-100 text-indigo-600"
                          }`}
                        >
                          <FiBell className="w-5 h-5" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-base sm:text-sm font-medium text-gray-800">
                            {notification.text}
                          </p>
                          <p className="text-sm sm:text-xs text-gray-500 mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed sm:static inset-y-0 left-0 z-30 w-4/5 sm:w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Chats</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotificationPanel(true)}
              className="relative p-2 text-gray-500 hover:text-indigo-600 active:bg-gray-200 rounded-full"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <FiBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowSidebar(false)}
              className="sm:hidden p-2 text-gray-500 hover:text-indigo-600 active:bg-gray-200 rounded-full"
              aria-label="Close sidebar"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              navigate("/chats");
              setShowSidebar(false);
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-base sm:text-sm font-medium ${
              !receiverId
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 active:bg-gray-200"
            }`}
            aria-current={!receiverId ? "page" : undefined}
          >
            <FiInbox className="w-5 h-5" />
            All Chats
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                navigate(`/chats/${currentUser._id}/received`);
                setShowSidebar(false);
              }
            }}
            className={`flex-1 py-3 flex items-center justify-center gap-2 text-base sm:text-sm font-medium ${
              selectedUser?._id === currentUser?._id
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 active:bg-gray-200"
            }`}
            aria-current={selectedUser?._id === currentUser?._id ? "page" : undefined}
          >
            <FiSend className="w-5 h-5" />
            My Chats
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {isLoading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                </div>
              ))}
            </div>
          )}
          {!isLoading && users.length === 0 && (
            <p className="text-center text-gray-500 py-4 text-base">No users found</p>
          )}
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors active:bg-gray-200 ${
                selectedUser?._id === user._id
                  ? "bg-indigo-50 border border-indigo-100"
                  : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleUserClick(user);
                }
              }}
              aria-label={`Chat with ${user.fullname}`}
            >
              <div className="relative">
                <img
                  src={user.profileImage || "/default-user.png"}
                  alt={user.fullname}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {user.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <div className="text-base sm:text-sm font-medium text-gray-700">
                  {user.fullname}
                </div>
                <div className="text-sm sm:text-xs text-gray-500">
                  {user.lastSeen
                    ? `Last seen ${new Date(user.lastSeen).toLocaleTimeString()}`
                    : "Offline"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setShowEdit(true);
              setShowSidebar(false);
            }}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md text-base font-medium active:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center justify-center gap-2"
            disabled={isLoading}
            aria-label="Edit profile"
          >
            <FiEdit2 className="w-5 h-5" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Hamburger Menu for Mobile */}
        <div className="sm:hidden p-4 border-b border-gray-200 flex justify-between items-center bg-white">
          <button
            onClick={() => setShowSidebar(true)}
            className="p-2 text-gray-500 hover:text-indigo-600 active:bg-gray-200 rounded-full"
            aria-label="Open sidebar"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedUser ? `Chat with ${selectedUser.fullname}` : "Chats"}
          </h2>
          <div className="w-6" /> {/* Placeholder for alignment */}
        </div>

        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 p-4"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FiX className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-base sm:text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {showEdit ? (
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <form
              onSubmit={handleUpdate}
              className="w-full max-w-lg sm:max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Profile</h2>

              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-indigo-100"
                  />
                  <label
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer active:bg-gray-200"
                    aria-label="Upload profile image"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <FiEdit2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </label>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="fullname"
                    className="block text-base sm:text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullname"
                    type="text"
                    value={editData.fullname}
                    onChange={(e) =>
                      setEditData({ ...editData, fullname: e.target.value })
                    }
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-base sm:text-sm"
                    placeholder="Enter full name"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition text-base sm:text-sm"
                  disabled={isLoading}
                  aria-label="Cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 sm:py-2 bg-indigo-600 text-white rounded-lg active:bg-indigo-700 disabled:bg-indigo-400 transition flex items-center gap-2 text-base sm:text-sm"
                  disabled={isLoading}
                  aria-label="Save profile changes"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 sm:h-4 sm:w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : selectedUser ? (
          chatMode === "received" ? (
            <ReceivedChat receiverId={selectedUser._id} socket={socket} />
          ) : (
            <SendChat receiverId={selectedUser._id} socket={socket} />
          )
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg sm:text-xl">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;