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

  

// 🔒 Block a user
export const blockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetId = req.params.userId;

    if (userId.toString() === targetId) {
      return res.status(400).json({ error: "You can't block yourself." });
    }

    const user = await User.findById(userId);
    if (!user.blockedUsers.includes(targetId)) {
      user.blockedUsers.push(targetId);
      await user.save();
      return res.status(200).json({ success: true, message: "User blocked successfully." });
    } else {
      return res.status(200).json({ message: "User is already blocked." });
    }
  } catch (err) {
    console.error("Error in blockUser:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
};


// ✅ Unblock a user
export const unblockUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.userId;

    const user = await User.findById(userId);

    // Filter out the user from blockedUsers
    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== targetId
    );
    await user.save();

    res.status(200).json({ success: true, message: "User unblocked successfully." });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

// 📋 Get list of blocked users
export const getBlockedUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("blockedUsers", "fullname email");

    res.status(200).json({ success: true, blockedUsers: user.blockedUsers });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
};


