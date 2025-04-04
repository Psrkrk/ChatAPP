import express from "express";
import { getAllUsers, getUserById, updateUserProfile, deleteUserAccount } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();

// ✅ Fetch all users (Admin only - add role check later if needed)
router.get("/user", verifyToken, getAllUsers);

// ✅ Fetch a single user by ID
router.get("user/:id", verifyToken, getUserById);

// ✅ Update logged-in user profile
router.put("/user/update", verifyToken, updateUserProfile);


// DELETE User Account
router.delete("/user/delete", verifyToken, deleteUserAccount);

export default router;
