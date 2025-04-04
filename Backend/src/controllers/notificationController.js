import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js"




export const createNotification = async (req, res) => {
  try {
    const { userId, type, message } = req.body;

    // Check if the user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new notification
    const notification = new Notification({
      user: userId,
      type,
      message,
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("Error in createNotification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT token

    console.log("Fetching notifications for user:", userId); // Debugging

    // Fetch notifications and populate user details
    const notifications = await Notification.find({ user: userId })
      .populate("user", "fullname email profileImage") // Get user details
      .sort({ createdAt: -1 });

    if (!notifications.length) {
      return res.status(200).json({
        success: true,
        message: "No notifications found",
        notifications: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    console.error("Error in getNotifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Validate notificationId
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({ error: "Invalid notification ID" });
    }

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete Notification
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteNotification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
