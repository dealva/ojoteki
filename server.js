const express = require('express');
const next = require('next');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*', // or your frontend domain
    },
  });

  // Setup WebSocket events
  io.on('connection', (socket) => {
    // console.log(`Socket connected: ${socket.id}`);

    socket.on('join_conversation_room', ({ conversation_id }) => {
      socket.join(conversation_id.toString());
      // console.log(`Socket joined room ${conversation_id}`);
    });

    socket.on('send_message', (message) => {
      const roomId = message.conversation_id || message.roomId; // use conversation_id as the room
      if (!roomId) return console.warn('Missing roomId');

      io.to(roomId.toString()).emit('message', message);
      // console.log(`Message sent to room ${roomId}:`, message);
    });

    socket.on('disconnect', () => {
      // console.log(`Socket disconnected: ${socket.id}`);
    });
  });
  // Pass all HTTP requests to Next.js
  app.all('*all', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
