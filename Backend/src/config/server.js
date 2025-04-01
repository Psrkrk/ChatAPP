import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with enhanced CORS and security settings
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true
  }
});

// User socket mapping with additional metadata
const userSockets = new Map(); // Using Map instead of object for better performance

/**
 * Get socket ID for a user with validation
 * @param {string} userId - User ID to lookup
 * @returns {string|null} Socket ID if found, null otherwise
 */
export const getReceiverSocketId = (userId) => {
  if (!userId || typeof userId !== 'string') return null;
  return userSockets.get(userId)?.socketId || null;
};

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Extract and validate user ID from handshake
  const userId = socket.handshake.auth?.userId || socket.handshake.query?.userId;
  if (!userId || typeof userId !== 'string') {
    console.warn(`Invalid user ID from socket ${socket.id}`);
    return socket.disconnect(true); // Force disconnect invalid connections
  }

  // Check for existing connection
  const existingConnection = userSockets.get(userId);
  if (existingConnection) {
    console.log(`User ${userId} already connected on ${existingConnection.socketId}`);
    // Disconnect previous socket if it's different
    if (existingConnection.socketId !== socket.id) {
      io.to(existingConnection.socketId).disconnectSockets();
    }
  }

  // Store new connection with timestamp
  userSockets.set(userId, {
    socketId: socket.id,
    connectedAt: new Date(),
    userAgent: socket.handshake.headers['user-agent']
  });

  console.log(`User ${userId} connected as ${socket.id}`);
  console.log(`Active users: ${userSockets.size}`);

  // Notify all clients about online users
  io.emit("onlineUsers", Array.from(userSockets.keys()));

  // Handle disconnection
  socket.on("disconnect", (reason) => {
    console.log(`User ${userId} disconnected (${reason})`);
    
    // Only remove if this is the current active connection
    if (userSockets.get(userId)?.socketId === socket.id) {
      userSockets.delete(userId);
    }

    io.emit("onlineUsers", Array.from(userSockets.keys()));
    console.log(`Remaining users: ${userSockets.size}`);
  });

  // Handle custom disconnect event from client
  socket.on("forceDisconnect", () => {
    socket.disconnect(true);
  });

  // Error handling
  socket.on("error", (err) => {
    console.error(`Socket error for user ${userId}:`, err);
  });
});

// Cleanup inactive connections periodically
setInterval(() => {
  const now = new Date();
  const timeout = 30 * 60 * 1000; // 30 minutes
  let cleaned = 0;

  userSockets.forEach((info, userId) => {
    if (now - info.connectedAt > timeout) {
      io.to(info.socketId).disconnectSockets();
      userSockets.delete(userId);
      cleaned++;
    }
  });

  if (cleaned > 0) {
    console.log(`Cleaned up ${cleaned} inactive connections`);
    io.emit("onlineUsers", Array.from(userSockets.keys()));
  }
}, 5 * 60 * 1000); // Check every 5 minutes

// Health check endpoint
app.get('/socket-health', (req, res) => {
  res.json({
    status: 'healthy',
    activeConnections: userSockets.size,
    uptime: process.uptime()
  });
});

export { app, io, server };