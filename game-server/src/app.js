const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

const players = {}

const KEY_CODE = {
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    UP_ARROW: 38,
    DOWN_ARROW: 40
}

//player = {x:1, y:1, color:'blue' }
function movePlayer(command, playerId) {
    if (command.keyCode === KEY_CODE.LEFT_ARROW) {
        players[playerId].x -= 1;
        return;
    }
    if (command.keyCode === KEY_CODE.RIGHT_ARROW) {
        players[playerId].x += 1;
        return;
    }
    if (command.keyCode === KEY_CODE.UP_ARROW) {
        players[playerId].y -= 1;
        return;
    }
    if (command.keyCode === KEY_CODE.DOWN_ARROW) {
        players[playerId].y += 1;
        return;
    }
}

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    players[socket.id] = { x: 1, y: 1, color: 'blue' };

    socket.on('new-message', (message) => {
        socket.broadcast.emit('new-message', `New message from ${socket.id} : ${message}`);
    })

    socket.on('new-command', (command) => {
        //command = {keyCode:36}
        movePlayer(command, socket.id);
        io.emit('game-state', players);
    })

});

app.get('/server/status', (req, res) => {
    res.status(200).send({ message: `Game server online on port ${server.address().port}` });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`started on port: ${port}`);
});