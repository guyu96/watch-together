const path = require('path');
const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

io.on('connection', socket => {
  console.log(`Socket ${socket.id} connected.`);
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected.`);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
