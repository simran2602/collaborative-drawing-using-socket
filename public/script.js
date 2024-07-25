const socket = io();
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let drawing = false;

canvas.addEventListener('mousedown', () => drawing = true);
canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mousemove', draw);

function draw(event) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    context.lineTo(x, y);
    context.stroke();
    socket.emit('draw', { x, y });
}

socket.on('draw', (data) => {
    context.lineTo(data.x, data.y);
    context.stroke();
});

function setUsername() {
    const username = document.getElementById('username').value;
    socket.emit('setUsername', username);
}

function joinRoom() {
    const room = document.getElementById('room').value;
    socket.emit('joinRoom', room);
}
