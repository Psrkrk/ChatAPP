import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { updateUserProfile } from '../controllers/profileController.js';
import verifyToken from '../middleware/verifyTokenMiddleware.js';

const router = express.Router();

// Get current file's URL and resolve it to a directory path
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload directory for profile images
const uploadDir = path.join(__dirname, "../../public/uploads");

// Define file type filter
const fileFilter = (req, file, cb) => {
  // Allowed image file extensions
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'), false);
  }
  cb(null, true);  // Accept the file
};

// Configure multer storage and validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Save in the 'public/uploads' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);  // Unique file name based on timestamp
  }
});

// Multer middleware for file upload with file type validation (no size limit)
const upload = multer({ storage, fileFilter });

// Middleware for handling Multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // File type error handling
    if (err.message === 'Only image files are allowed (jpeg, jpg, png, gif)') {
      return res.status(400).json({ error: err.message });
    }
  }
  next(err);  // Pass other errors to the next handler
};

// @route   PUT /api/v1/user/update-profile
// @desc    Update user's profile details (fullname, email, profile photo)
// @access  Private
router.put(
  "/user/update-profile",
  verifyToken, // Ensure the user is authenticated
  upload.single("profileImage"), // Handle single file upload
  updateUserProfile // Call the controller to update the profile
);

// Use global Multer error handler
router.use(handleMulterError);

export default router;
