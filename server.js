const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('setUsername', (username) => {
        users[socket.id] = username;
        console.log(`Username set: ${username}`);
    });

    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    });

    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`${users[socket.id]} joined room: ${room}`);
        socket.to(room).emit('message', `${users[socket.id]} has joined the room`);
    });

    socket.on('privateMessage', (data) => {
        const { to, message } = data;
        const recipientSocket = Object.keys(users).find(id => users[id] === to);
        if (recipientSocket) {
            io.to(recipientSocket).emit('privateMessage', { from: users[socket.id], message });
        } else {
            console.log(`Recipient with username ${to} not found`);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
