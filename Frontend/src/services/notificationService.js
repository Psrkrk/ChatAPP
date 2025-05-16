import axios from "axios";

// Base API URL
const BASE_API = "/api/v1";

const notificationService = {
  // 🔔 Send a new notification (e.g., when a message is sent)
  createNotification: async (data) => {
    const response = await axios.post(`${BASE_API}/notification`, data);
    return response.data; // Assumes { success: true, notification: {...} }
  },

  // 📬 Get all notifications for a specific user
  getNotifications: async (userId) => {
    const response = await axios.get(`${BASE_API}/notify/${userId}`);
    return response.data; // Assumes { notifications: [...] }
  },

  // ✅ Mark a specific notification as read
  markAsRead: async (notificationId) => {
    const response = await axios.patch(`${BASE_API}/notify/${notificationId}/read`);
    return response.data; // Assumes { success: true }
  },
};

export default notificationService;
