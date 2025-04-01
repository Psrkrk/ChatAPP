import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hide password from query results
  userRole: {
    type: String,
    enum: ["user", "admin"],
    default: "user", // Set default role to "user"
  },
  profileImage: { type: String, default: "" }, // Store profile image URL
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);

export default User;
