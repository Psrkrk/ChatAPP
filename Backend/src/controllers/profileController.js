import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url'; // ✅ FIX: Import this
import User from "../models/userModel.js";

// ✅ FIX: Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Update User Profile (with profile image update)
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname, email } = req.body;

    // 🔍 Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // 📧 Check for duplicate email
    if (email && email !== user.email) {
      const existingEmailUser = await User.findOne({ email });
      if (existingEmailUser && existingEmailUser._id.toString() !== userId) {
        return res.status(400).json({ error: "Email is already in use by another account" });
      }
    }

    // 🧑‍💼 Check for duplicate name
    if (fullname && fullname !== user.fullname) {
      const existingNameUser = await User.findOne({ fullname });
      if (existingNameUser && existingNameUser._id.toString() !== userId) {
        return res.status(400).json({ error: "Name is already in use by another account" });
      }
    }

    // ✏️ Prepare update data
    const updateData = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;

    // 🖼️ Handle profile image update
    if (req.file) {
      // 🗑️ Delete old image if it exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "../../public", user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // 📁 Save new image path
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    // ✅ Update user document
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    // ✅ Send response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      profileImage: updatedUser.profileImage ? `http://localhost:5000${updatedUser.profileImage}` : ""
    });

  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
