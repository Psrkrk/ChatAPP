import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import User from "../models/userModel.js";

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // ✅ Check if the new fullname is actually different
    const isFullnameChanged =
      fullname && fullname.trim() !== "" && fullname !== user.fullname;

    const isNewImageUploaded = !!req.file;

    // 🛑 Nothing to update
    if (!isFullnameChanged && !isNewImageUploaded) {
      return res.status(400).json({
        success: false,
        error: "No changes provided. Please update name or profile image.",
      });
    }

    // 🔁 Check if new name is already taken by another user
    if (isFullnameChanged) {
      const existingUser = await User.findOne({ fullname });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          error: "Name is already in use by another account",
        });
      }
    }

    // ✏️ Prepare data to update
    const updateData = {};
    if (isFullnameChanged) updateData.fullname = fullname;

    if (isNewImageUploaded) {
      // 🧹 Delete old image if exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "../../public", user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    // ✅ Update user and return updated data
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      profileImage: updatedUser.profileImage
        ? `${req.protocol}://${req.get("host")}${updatedUser.profileImage}`
        : "",
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
};
