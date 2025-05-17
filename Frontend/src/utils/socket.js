import { io } from 'socket.io-client';

// Use your backend WebSocket URL here
const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: false,
});

export default socket;
