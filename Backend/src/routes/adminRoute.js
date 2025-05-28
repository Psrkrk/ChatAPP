// routes/adminRoutes.js

import express from "express";
import {
  getAllUsers,
  deleteUserAccount,
  blockUser,
  unblockUser,
} from "../controllers/adminController.js";
import verifyToken from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();

// ✅ Routes
router.get("/users", verifyToken, getAllUsers);
router.delete("/delete", verifyToken, deleteUserAccount);
router.post("/block/:userId", verifyToken, blockUser);
router.post("/unblock/:userId", verifyToken, unblockUser);

export default router;
