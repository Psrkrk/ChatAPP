import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import authRoute from "./src/routes/authRoute.js";
import messageRoute from "./src/routes/messageRoute.js";
import profileRoute from "./src/routes/profileRoute.js";
import userRoute from "./src/routes/userRoute.js"
import notificationRoute from "./src/routes/notificationRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Needed for form data
app.use(cookieParser());
app.use(cors({ 
  origin: ["http://localhost:3001"], // Adjust for multiple origins
  credentials: true 
}));

// Serve static files (profile images)
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB with error handling
connectDB().catch(err => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1); // Exit process on DB connection failure
});

// Routes
app.use("/api/v1", authRoute); // ✅ Forgot Password routes are now part of `authRoute.js`
app.use("/api/v1", messageRoute);
app.use("/api/v1", profileRoute);
app.use("/api/v1", userRoute)
app.use("/api/v1/", notificationRoute)

// Root Route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Handle non-existent routes (404)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
