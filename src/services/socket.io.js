/* socket.js */
import { Server as SocketIOServer } from 'socket.io';
let io;
export function initializeSocketIO(server) {
  io = new SocketIOServer(server, {
    cors: {
      path: '/api/socket.io',
      origin: '*', /* Allow connections from all origins */
      methods: ["GET", "POST"]
    }
  });
  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
    /* Add other socket event listeners here */
  });
  return io;
}
export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}
export const emitSocketEvent = (eventName, data) => {
  const io = getIO();
  io.emit(eventName, data);
}









