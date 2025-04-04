import User from "../models/userModel.js";

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in getUserById:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Update user profile (except password)
export const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user.id; // Extract user ID from JWT token
      const { fullname, email } = req.body;
  
      // Check if the new email is already in use by another user
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ error: "Email is already in use by another account" });
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullname, email },
        { new: true, runValidators: true }
      ).select("-password");
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.error("Error in updateUserProfile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

   // Find and delete the user
  export const deleteUserAccount = async (req, res) => {
    try {
      const userId = req.user.id; // Extract user ID from JWT token
  
     
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({ success: true, message: "User account deleted successfully" });
    } catch (error) {
      console.error("Error in deleteUserAccount:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  