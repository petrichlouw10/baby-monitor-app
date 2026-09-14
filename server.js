const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// CHANGE THIS: Create a secure password for your monitor
const SECURE_PASSWORD = "MySecureBabyMonitor2026!"; 

io.on('connection', (socket) => {
  socket.on('join-room', (data) => {
    // Security check: disconnect if password doesn't match
    if (data.password !== SECURE_PASSWORD) {
      return socket.emit('error-msg', 'Access Denied: Invalid Password!');
    }
    socket.join(data.roomName);
    socket.to(data.roomName).emit('user-connected', socket.id);
  });

  // Relay WebRTC connection details only to users in the same room
  socket.on('signal', (data) => {
    socket.to(data.roomName).emit('signal', {
      sender: socket.id,
      signal: data.signal
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
