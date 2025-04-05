import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  userRole: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profileImage: { 
    type: String, 
    default: "" 
  },

  // 🔔 Reference to notifications
  notifications: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Notification" 
    }
  ],

  // 🚫 List of blocked user IDs
  blockedUsers: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    }
  ],

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
