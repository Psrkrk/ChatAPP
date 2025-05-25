import { io } from 'socket.io-client';

// Use relative path so Vite proxy handles it during development
const socket = io('/', {
  transports: ['websocket'], // or omit if not needed
  autoConnect: false,
});

export default socket;
