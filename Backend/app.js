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

// Resolve __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Serve static files from public/uploads (correct folder)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173"], // frontend port
  credentials: true
}));

// Connect to MongoDB
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

// Default route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
