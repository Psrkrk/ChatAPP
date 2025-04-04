import express from "express";
import { updateProfileImage, upload, getUserProfile } from "../controllers/profileController.js";
import verifyToken from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();

// Route to handle profile image update
router.put(
  "/update-profile-image",
  verifyToken, 
  upload.single("profileImage"), 
  updateProfileImage
);

// Route to get user profile
router.get("/profile", verifyToken, getUserProfile);

export default router;
