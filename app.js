const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const Drawing = require('./Drawing.mjs');
const ColorPicker = require('./ColorPicker');
const Eraser = require('./Eraser');
const database = require('./database');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing drawings to the new user
  database.getAllDrawings((err, rows) => {
    if (err) {
      console.error(err);
    } else {
      socket.emit('drawings', rows);
    }
  });

  // Receive new drawings from the user
  socket.on('drawing', (data) => {
    // Save the drawing to the database
    database.saveDrawing(data);

    // Broadcast the drawing to all connected users
    socket.broadcast.emit('drawing', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
