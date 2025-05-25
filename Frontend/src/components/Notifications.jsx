import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotifications,
  markNotificationAsRead,
  createNotification,
} from "../redux/notificationSlice.js";
import { BellIcon, CheckIcon, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get current logged-in userId from auth slice (adjust path if different)
  const userId = useSelector((state) => state.auth.user?._id);

  // Select notifications state
  const notificationsState = useSelector((state) => state.notifications || {});
  const { notifications = [], isLoading = false, error = null } = notificationsState;

  useEffect(() => {
    if (userId) {
      dispatch(getNotifications(userId));
    }
  }, [dispatch, userId]);

  const handleMarkAsRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const handleCreate = () => {
    if (!userId) return;
    const newNotification = {
      userId, // send notification to current user (adjust as needed)
      type: "message",
      message: "You received a new message from John!",
      read: false,
    };
    dispatch(createNotification(newNotification));
  };

  const handleNotificationClick = (notification) => {
    if (notification?.userId) {
      navigate(`/chats/${notification.userId}/received`);
      dispatch(markNotificationAsRead(notification._id));
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <BellIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
              Notifications
            </h2>
            {notifications.length > 0 && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-600 text-white rounded-full">
                {notifications.filter(n => !n.read).length} unread
              </span>
            )}
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm md:text-base"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Dummy</span>
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 text-center">
              <p className="text-red-500 font-medium">{error}</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 flex flex-col items-center">
                <BellIcon className="w-10 h-10 mb-2" />
                <p>No notifications yet</p>
                <p className="text-sm mt-1">We'll notify you when something arrives</p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`relative cursor-pointer transition-colors duration-150 ${
                    notification.read ? "bg-white" : "bg-blue-50"
                  } hover:bg-gray-50`}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            notification.type === "message" 
                              ? "bg-purple-100 text-purple-800" 
                              : notification.type === "alert" 
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                          }`}>
                            {notification.type?.toUpperCase()}
                          </span>
                          {!notification.read && (
                            <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                          )}
                        </div>
                        <p className="text-sm md:text-base text-gray-800">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification._id);
                          }}
                          className="ml-2 p-1.5 rounded-full hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition-colors"
                          aria-label="Mark as read"
                        >
                          <CheckIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;