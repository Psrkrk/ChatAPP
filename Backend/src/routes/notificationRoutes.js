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


// ✅ Get All Notifications
router.get("/notification", verifyToken, getNotifications);

//read 

router.put("/:notificationId/read", verifyToken, markNotificationAsRead);

// ✅ Delete Notification
router.delete("/:notificationId", verifyToken, deleteNotification);

export default router;
