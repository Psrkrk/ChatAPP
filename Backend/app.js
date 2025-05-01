import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./src/config/database.js";
import authRoute from "./src/routes/authRoute.js";
import messageRoute from "./src/routes/messageRoute.js";
import profileRoute from "./src/routes/profileRoute.js";
import userRoute from "./src/routes/userRoute.js";
import notificationRoute from "./src/routes/notificationRoutes.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Fix for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173"], // Add other origins if needed
  credentials: true
}));

// Serve static files
const uploadsPath = path.join(__dirname, "public", "uploads");
app.use("/uploads", express.static(uploadsPath));

// Connect to MongoDB with error handling
connectDB().catch(err => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});

// API Routes
app.use("/api/v1", authRoute);
app.use("/api/v1", messageRoute);
app.use("/api/v1", profileRoute);
app.use("/api/v1", userRoute);
app.use("/api/v1", notificationRoute);

// Root route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
