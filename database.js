const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

// Create a table to store the drawings
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS drawings (id INTEGER PRIMARY KEY AUTOINCREMENT, data TEXT)');
});

const getAllDrawings = (callback) => {
  db.all('SELECT * FROM drawings', (err, rows) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows);
    }
  });
};

const saveDrawing = (data) => {
  db.run('INSERT INTO drawings (data) VALUES (?)', [data]);
};

module.exports = {
  getAllDrawings,
  saveDrawing
};
