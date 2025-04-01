import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/database.js"; // 🔹 Ensure `.js` extension in module imports

import authRoute from "./src/routes/authRoute.js";
import messageRoute from "./src/routes/messageRoute.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3001", credentials: true })); // 🔹 Ensures CORS allows cookies
app.use("/uploads", express.static("uploads")); // ✅ Serves static files correctly

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/v1", authRoute); // 🔹 Added `/auth` for better API structure
app.use("/api/v1", messageRoute);

const PORT = process.env.PORT || 5000; // 🔹 Supports dynamic port assignment

// Root Route
app.get("/", (req, res) => {
    res.send("Hello, Express!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
