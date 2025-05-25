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
    const profileImage = req.file;

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updateData = {};

    // 🚀 Always replace name if provided
    if (fullname) {
      updateData.fullname = fullname.trim();
    }

    // 🚀 Always replace profile image if provided
    if (profileImage) {
      // Delete old profile image if exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "../../public", user.profileImage);
        try {
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error("Failed to delete old profile image:", err);
        }
      }

      // Save new image path
      updateData.profileImage = `/uploads/${profileImage.filename}`;
    }

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

  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
};
