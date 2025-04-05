import express from "express";
import {
  createNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import verifyToken from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();

// ✅ Create a Notification
router.post("/", verifyToken, createNotification);

// ✅ Get All Notifications for a user
router.get("/notification", verifyToken, getNotifications);

// ✅ Mark Notification as Read
router.put("/notify/:notificationId/read", verifyToken, markNotificationAsRead);

// ✅ Delete Notification
router.delete("/delete/notification/:notificationId", verifyToken, deleteNotification);

export default router;
