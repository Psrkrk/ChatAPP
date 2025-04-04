import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // 🔹 Add indexing for faster queries
    },
    type: {
      type: String,
      enum: ["message", "friend_request", "mention", "alert"],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true, // 🔹 Remove unnecessary spaces
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔹 Add an index for better performance on frequently searched fields
notificationSchema.index({ user: 1, isRead: 1 });

export default mongoose.model("Notification", notificationSchema);
