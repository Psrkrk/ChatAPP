import express from "express";
import { getAllUsers, deleteUserAccount,blockUser,unblockUser,getBlockedUsers } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();

// ✅ Fetch all users (Admin only - add role check later if needed)
router.get("/user", verifyToken, getAllUsers);

// DELETE User Account
router.delete("/user/delete", verifyToken, deleteUserAccount);

// 🔒 Block a user
router.put("/block/:userId", verifyToken, blockUser);

// ✅ Unblock a user
router.put("/unblock/:userId", verifyToken, unblockUser);

// 📋 Get list of blocked users
router.get("/blocked-users", verifyToken, getBlockedUsers);


export default router;
