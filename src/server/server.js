const path = require('path');
const express = require('express');
const http = require('http');
const SocketIO = require('socket.io');

const Party = require('./Party');

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server);

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const party = new Party(io);
io.on('connection', socket => {
  console.log(`${socket.id} connected`);
  party.addSocket(socket.id);
  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
    party.removeSocket(socket.id);
  });
  socket.on('start-party', () => {
    console.log(`${socket.id} start-party`);
    party.startParty(socket.id);
  });
  socket.on('join-party', data => {
    console.log(`${socket.id} join-party`, data);
    party.joinParty(socket.id, data['party-id']);
  });
  socket.on('leave-party', () => {
    console.log(`${socket.id} leave-party`);
    party.leaveParty(socket.id);
  });
  socket.on('sync-play', () => {
    console.log(`${socket.id} play`);
    party.sync(socket.id, 'play');
  });
  socket.on('sync-pause', () => {
    console.log(`${socket.id} pause`);
    party.sync(socket.id, 'pause');
  });
  socket.on('sync-seek', data => {
    console.log(`${socket.id} seek`);
    party.sync(socket.id, 'seek', data);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
