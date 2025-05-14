import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; // ✅ FIX: Import this
import User from "../models/userModel.js";

// ✅ FIX: Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname } = req.body;

    const hasNewName = fullname && fullname.trim() !== "";
    const hasNewImage = req.file;

    // 🛑 Nothing to update
    if (!hasNewName && !hasNewImage) {
      return res.status(400).json({
        success: false,
        error: "No changes provided. Please update name or profile image.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // 🔁 Check if fullname is different and already taken
    if (hasNewName && fullname !== user.fullname) {
      const existingNameUser = await User.findOne({ fullname });
      if (existingNameUser && existingNameUser._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          error: "Name is already in use by another account",
        });
      }
    }

    const updateData = {};
    if (hasNewName) updateData.fullname = fullname;

    if (hasNewImage) {
      // 🧹 Delete old image
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "../../public", user.profileImage);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

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
