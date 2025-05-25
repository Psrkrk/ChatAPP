import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app); // Create HTTP server from Express app

// Initialize Socket.IO server with CORS and reconnection settings
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow frontend origin
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes for reconnect
    skipMiddlewares: true
  }
});

// Map to track which user is connected to which socket
const userSockets = new Map();

/**
 * Utility: Get socket ID for a user
 * @param {string} userId - ID of the user
 * @returns {string|null} socket ID or null if not connected
 */
export const getReceiverSocketId = (userId) => {
  if (!userId || typeof userId !== 'string') return null;
  return userSockets.get(userId)?.socketId || null;
};

// Socket.IO: Handle new client connection
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Extract userId from client authentication
  const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;

  // Validate userId
  if (!userId || typeof userId !== 'string') {
    console.warn(`Invalid user ID from socket ${socket.id}`);
    return socket.disconnect(true); // Disconnect invalid socket
  }

  // If the user is already connected, disconnect the old socket
  const existingConnection = userSockets.get(userId);
  if (existingConnection && existingConnection.socketId !== socket.id) {
    io.to(existingConnection.socketId).disconnectSockets(); // Kick out previous connection
  }

  // Store userId with socket metadata
  userSockets.set(userId, {
    socketId: socket.id,
    connectedAt: new Date(),
    userAgent: socket.handshake.headers['user-agent']
  });

  console.log(`User ${userId} connected as ${socket.id}`);
  console.log(`Active users: ${userSockets.size}`);

  // Notify all clients of updated online users
  io.emit("onlineUsers", Array.from(userSockets.keys()));

  // Handle disconnect event
  socket.on("disconnect", (reason) => {
    console.log(`User ${userId} disconnected (${reason})`);

    // Remove socket only if it matches the stored one
    if (userSockets.get(userId)?.socketId === socket.id) {
      userSockets.delete(userId);
    }

    // Update all clients with online users
    io.emit("onlineUsers", Array.from(userSockets.keys()));
    console.log(`Remaining users: ${userSockets.size}`);
  });

  // Optional: Custom event to allow client to force disconnect
  socket.on("forceDisconnect", () => {
    socket.disconnect(true);
  });

  // Handle socket errors
  socket.on("error", (err) => {
    console.error(`Socket error for user ${userId}:`, err);
  });
});

// Cleanup inactive users periodically (every 5 minutes)
setInterval(() => {
  const now = new Date();
  const timeout = 30 * 60 * 1000; // 30 minutes
  let cleaned = 0;

  userSockets.forEach((info, userId) => {
    if (now - info.connectedAt > timeout) {
      io.to(info.socketId).disconnectSockets(); // Disconnect inactive user
      userSockets.delete(userId);
      cleaned++;
    }
  });

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} inactive connections`);
    io.emit("onlineUsers", Array.from(userSockets.keys()));
  }
}, 5 * 60 * 1000);

// Simple endpoint to check socket health
app.get('/socket-health', (req, res) => {
  res.json({
    status: 'healthy',
    activeConnections: userSockets.size,
    uptime: process.uptime()
  });
});

// Export everything
export { app, io, server };
