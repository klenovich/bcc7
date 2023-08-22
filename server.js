const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const db = new sqlite3.Database(':memory:');

// Create a table to store the drawings
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS drawings (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)');
});

// Serve static files
app.use(express.static('public'));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Send existing drawings to the new user
  db.all('SELECT * FROM drawings', (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      socket.emit('drawings', rows);
    }
  });

  // Receive new drawings from the user
  socket.on('drawing', (data) => {
    // Save the drawing to the database
    db.run('INSERT INTO drawings (data) VALUES (?)', [data]);

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
