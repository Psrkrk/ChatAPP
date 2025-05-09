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

// ✅ Upload directory: public/uploads
const uploadDir = path.join(__dirname, "../../public/uploads");

// ✅ Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);  // Add timestamp to avoid name conflicts
    cb(null, uniqueName);
  },
});

// ✅ File type validation (only images allowed)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    // Send error message to the client without crashing the server
    return cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'), false);
  }
  cb(null, true);
};

// ✅ Multer instance with file filter and storage
const upload = multer({ 
  storage, 
  fileFilter,
}).single('profileImage');  // Single file upload for profile image

// ✅ Middleware to handle Multer errors globally
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer specific errors
    if (err.message === 'Only image files are allowed (jpeg, jpg, png, gif)') {
      return res.status(400).json({ error: err.message });
    }
    // Handle file size limit errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Max limit is 2MB.' });
    }
  }
  next(err);  // Pass other errors to the next handler
};

// ✅ Auth Routes
router.post("/register", upload, Register);  // Apply the upload middleware to the register route
router.post("/login", login);
router.post("/logout", verifyToken, Logout);

// ✅ OTP & Password Reset Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

// ✅ Use the global Multer error handler
router.use(handleMulterError);

export default router;
