import express from "express";
import { getMessage, sendMessage } from "../controllers/messageController.js";
import verifyToken from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();

// Validate `id` parameter before processing request
router.post("message/send/:id", verifyToken, sendMessage);
router.get("message/get/:id", verifyToken,  getMessage);

export default router;
