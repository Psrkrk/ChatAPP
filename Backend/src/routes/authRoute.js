import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Needed to use __dirname in ES Modules

// import verifyToken from "../middleware/verifyTokenMiddleware.js";
import { Register, login, Logout } from "../controllers/authController.js";
import verifyToken from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();

// Get the current directory name (`__dirname` equivalent in ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use absolute path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage });

// Register route with Multer middleware
router.post("/register", upload.single("profileImage"), Register);
router.post("/login", login);
router.post("/logout" , verifyToken,  Logout);

export default router; // ✅ Use `export default` instead of `module.exports`
