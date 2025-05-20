import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import notificationService from "../services/notificationService";
import { toast } from "react-toastify";

const initialState = {
  notifications: [],
  isLoading: false,
  error: null,
};

// 📬 Get all notifications for a user
export const getNotifications = createAsyncThunk(
  "notification/getAll",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await notificationService.getNotifications(userId);
      return res.notifications;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load notifications");
    }
  }
);

// ✅ Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  "notification/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to mark as read");
    }
  }
);

// 🔔 Create a new notification
export const createNotification = createAsyncThunk(
  "notification/create",
  async (notificationData, { rejectWithValue }) => {
    try {
      const res = await notificationService.createNotification(notificationData);
      return res.notification;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to send notification");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Notifications
      .addCase(getNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Mark as Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) =>
          n._id === action.payload ? { ...n, read: true } : n
        );
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Create Notification
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload); // Add new notification at the top
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
