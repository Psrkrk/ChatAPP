import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from "../models/userModel.js";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { fullname } = req.body;
    const profileImageFile = req.file;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const trimmedFullname = fullname?.trim();
    const isFullnameValid = trimmedFullname?.length >= 2;
    const isNewImageUploaded = !!profileImageFile;

    if (!isFullnameValid && !isNewImageUploaded) {
      return res.status(400).json({
        success: false,
        error: "No valid data provided. Please provide a valid name or profile image.",
      });
    }

    const updateData = {};

    // ✅ Update name if it's different and valid
    if (isFullnameValid && trimmedFullname !== user.fullname) {
      const existingUser = await User.findOne({ fullname: trimmedFullname });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          error: "Name is already in use by another account",
        });
      }
      updateData.fullname = trimmedFullname;
    }

    // ✅ Handle new profile image
    if (isNewImageUploaded) {
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "../../public", user.profileImage);
        try {
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error("Failed to delete old profile image:", err);
        }
      }

      // Store new image path
      updateData.profileImage = `/uploads/${profileImageFile.filename}`;
    }

    // ✅ Save updates to DB
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    const profileImageUrl = updatedUser.profileImage
      ? `${req.protocol}://${req.get("host")}${updatedUser.profileImage}`
      : "";

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      profileImage: profileImageUrl,
    });
console.log("BODY:", req.body);
console.log("FILE:", req.file);
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
};
