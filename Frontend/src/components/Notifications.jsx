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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <BellIcon className="w-6 h-6" /> Notifications
        </h2>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
        >
          <PlusIcon className="w-4 h-4" /> Add Dummy
        </button>
      </div>

      {isLoading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications found.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              className={`cursor-pointer p-4 rounded-lg shadow-md ${
                notification.read ? "bg-white" : "bg-yellow-100"
              } hover:bg-yellow-200 transition`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {notification.type?.toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
                {!notification.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notification._id);
                    }}
                    className="text-green-600 hover:text-green-800"
                    aria-label="Mark as read"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notification;
