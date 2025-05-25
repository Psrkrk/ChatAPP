import axios from "axios";
import { toast } from "react-toastify";

// Base API URL from environment variable
const BASE_API = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : "/api/v1";

// Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_API,
  timeout: 10000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for consistent error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

const notificationService = {
  // 🔔 Send a new notification (e.g., when a message is sent)
  createNotification: async (data) => {
    try {
      const response = await axiosInstance.post("/notification", data);
      const { success, notification, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to create notification");
      }

      toast.success(message || "Notification sent successfully");
      return notification; // Return notification object
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },

  // 📬 Get all notifications for a specific user
  getNotifications: async (userId) => {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }
      const response = await axiosInstance.get(`/notification/${userId}`);
      const { success, notifications, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to fetch notifications");
      }

      return notifications || []; // Return array of notifications
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },

  // ✅ Mark a specific notification as read
  markAsRead: async (notificationId) => {
    try {
      if (!notificationId) {
        throw new Error("Notification ID is required");
      }
      const response = await axiosInstance.patch(`/notification/${notificationId}/read`);
      const { success, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to mark notification as read");
      }

      toast.success(message || "Notification marked as read");
      return true; // Return success indicator
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  },
};

export default notificationService;