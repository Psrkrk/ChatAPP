import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // `unique: true` is enough
  password: { type: String, required: true },
  userRole: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profileImage: { type: String, default: "" },
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
export default User;
