import multer from 'multer';
import fs from 'fs';
import path from 'path';
import User from "../models/userModel.js";

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve('uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);  // Save in 'uploads' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);  // Unique file name based on timestamp
  }
});

// Multer middleware for file upload
export const upload = multer({ storage });

// Controller to update the profile image
export const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;  // Assuming user ID is available in the token
    const profileImageUrl = `src/updateimg/${req.file.filename}`;

    // Update user profile image in the database
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: profileImageUrl },
      { new: true }  // Return the updated user document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Profile image updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// get profile

export const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const userId = req.user.id;

    // Find user in database (excluding password for security)
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user
    });

  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
