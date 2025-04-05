import { getReceiverSocketId, io } from "../config/server.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

// ✅ Send Message
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Check block status
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (sender.blockedUsers.includes(receiverId)) {
      return res.status(403).json({ error: "You have blocked this user." });
    }
    if (receiver.blockedUsers.includes(senderId)) {
      return res.status(403).json({ error: "You are blocked by this user." });
    }

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get Messages
export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(chatUser);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't fetch messages if blocked
    if (sender.blockedUsers.includes(chatUser) || receiver.blockedUsers.includes(senderId)) {
      return res.status(403).json({ error: "You cannot view messages with this user." });
    }

    const conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("Error in getMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete Message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const senderId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });
    if (message.senderId.toString() !== senderId.toString()) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    const conversation = await Conversation.findOne({
      members: { $all: [senderId, message.receiverId] },
    });

    if (conversation) {
      conversation.messages = conversation.messages.filter(
        (msgId) => msgId.toString() !== messageId
      );
      await conversation.save();
    }

    await message.deleteOne();
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Delete Conversation
export const deleteConversation = async (req, res) => {
  try {
    const { chatUserId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUserId] },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    await conversation.deleteOne();
    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.log("Error in deleteConversation", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
