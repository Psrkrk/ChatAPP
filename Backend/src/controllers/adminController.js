// import User from "../models/User.js";
// import Notification from "../models/Notification.js";
// import mongoose from "mongoose";

// // 🔐 Helper: check if ID is valid
// const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// // 🔹 Get all users (excluding passwords)
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

// // 🔹 Block a user
// export const blockUser = async (req, res) => {
//   const { userIdToBlock } = req.body;
//   const adminId = req.user._id;

//   if (!isValidObjectId(userIdToBlock)) {
//     return res.status(400).json({ message: "Invalid user ID to block" });
//   }

//   try {
//     const admin = await User.findById(adminId);
//     if (admin.userRole !== "admin") return res.status(403).json({ message: "Access denied" });

//     if (!admin.blockedUsers.includes(userIdToBlock)) {
//       admin.blockedUsers.push(userIdToBlock);
//       await admin.save();
//     }

//     res.status(200).json({ message: "User blocked successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error blocking user", error: err.message });
//   }
// };

// // 🔹 Unblock a user
// export const unblockUser = async (req, res) => {
//   const { userIdToUnblock } = req.body;
//   const adminId = req.user._id;

//   if (!isValidObjectId(userIdToUnblock)) {
//     return res.status(400).json({ message: "Invalid user ID to unblock" });
//   }

//   try {
//     const admin = await User.findById(adminId);
//     if (admin.userRole !== "admin") return res.status(403).json({ message: "Access denied" });

//     admin.blockedUsers = admin.blockedUsers.filter(id => id.toString() !== userIdToUnblock);
//     await admin.save();

//     res.status(200).json({ message: "User unblocked successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error unblocking user", error: err.message });
//   }
// };

// // 🔹 Send notification to a user
// export const sendNotification = async (req, res) => {
//   const { targetUserId, message } = req.body;
//   const adminId = req.user._id;

//   if (!isValidObjectId(targetUserId)) {
//     return res.status(400).json({ message: "Invalid user ID" });
//   }

//   try {
//     const admin = await User.findById(adminId);
//     if (admin.userRole !== "admin") return res.status(403).json({ message: "Access denied" });

//     const notification = new Notification({ user: targetUserId, message });
//     await notification.save();

//     const user = await User.findById(targetUserId);
//     user.notifications.push(notification._id);
//     await user.save();

//     res.status(200).json({ message: "Notification sent successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error sending notification", error: err.message });
//   }
// };

// // 🔹 Promote user to admin
// export const promoteToAdmin = async (req, res) => {
//   const { targetUserId } = req.body;
//   const adminId = req.user._id;

//   if (!isValidObjectId(targetUserId)) {
//     return res.status(400).json({ message: "Invalid target user ID" });
//   }

//   try {
//     const admin = await User.findById(adminId);
//     if (admin.userRole !== "admin") return res.status(403).json({ message: "Access denied" });

//     await User.findByIdAndUpdate(targetUserId, { userRole: "admin" });

//     res.status(200).json({ message: "User promoted to admin successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error promoting user", error: err.message });
//   }
// };
