import express from "express";
import { getMessage, sendMessage, deleteMessage, deleteConversation } from "../controllers/messageController.js";
import verifyToken from "../middleware/verifyTokenMiddleware.js";

const router = express.Router();

// Route to send a message
router.post("/message/send/:id", verifyToken, sendMessage);

// Route to get messages
router.get("/message/get/:id", verifyToken, getMessage);

// Route to delete a specific message by messageId
router.delete("/message/delete/:messageId", verifyToken, deleteMessage);

// Route to delete an entire conversation by chatUserId
router.delete("/conversation/delete/:chatUserId", verifyToken, deleteConversation);

export default router;
