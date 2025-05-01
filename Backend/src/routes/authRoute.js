import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import verifyToken from "../middleware/verifyTokenMiddleware.js";
import {
  Register,
  login,
  sendOTP,
  verifyOTP,
  resetPassword,
  Logout,
} from "../controllers/authController.js";

const router = express.Router();

// ✅ Get __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Define upload directory for profile images
const uploadDir = path.join(__dirname, "../../public/uploads/");

// ✅ Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer for profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname); // e.g., 1713728202000.png
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/* -------------------------------------------
 ✅ Auth Routes
--------------------------------------------*/
router.post("/register", upload.single("profileImage"), Register);
router.post("/login", login);
router.post("/logout", verifyToken, Logout);

/* -------------------------------------------
 ✅ OTP & Password Reset
--------------------------------------------*/
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;
