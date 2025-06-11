import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice.js";
import userReducer from "../redux/userSlice.js";
import chatReducer from "../redux/chatSlice.js"; // Ensure this file exists if uncommented
import notificationReducer from "../redux/notificationSlice.js";
import messageControlReducer from "../redux/messagecontrolSlice.js"; // Ensure this file exists if uncommented
import adminReducer from "../redux/adminSlice.js"; // Ensure this file exists if uncommented
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // Uncomment if you want to include userSlice
    chat: chatReducer, // Uncomment if chatSlice exists and is needed
    messageControl: messageControlReducer, // Ensure this is the correct reducer for your message controller
    notifications: notificationReducer, // Correct key
    admin: adminReducer, // Ensure this is the correct reducer for your admin functionality
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable data if needed (e.g., for file uploads in auth or user slices)
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
});

export default store;
