const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const routes = require('./routes/index');
app.use('/', routes);

var playersState = [];

//player = {x:1, y:1, color:'blue' }
function movePlayer(command, playerId) {

    const selectedCommand = {
        ArrowUp(player) {
            player.y -= 1;
            return;
        },
        ArrowDown(player) {
            player.y += 1;
            return;
        },
        ArrowLeft(player) {
            player.x -= 1;
            return;
        },
        ArrowRight(player) {
            player.x += 1;
            return;
        }
    }

    const keyPressed = command.key;
    const moveFunction = selectedCommand[keyPressed];
    const player = playersState.find(p => p.playerId === playerId);

    if (moveFunction && player) {
        moveFunction(player);
    }

}


let messages = [];

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    var player = { playerId: socket.id, x: 1, y: 1, color: 'blue' };
    playersState.push(player);
    io.emit('new-state', playersState);

    socket.on('new-command', (command) => {        
        movePlayer(command, socket.id);
        var player = playersState.find(p => p.playerId === socket.id);
        io.emit('update-player', player);
    });

    socket.emit('previous-messages', messages);

    socket.on('new-message', (message) => {
        messages.push(message);
        socket.broadcast.emit('new-message', `New message from ${socket.id} : ${message}`);
    });

    socket.on('send-message', data => {
        messages.push(data);
        socket.broadcast.emit('received-message', data);
    });

});

app.get('/status', (req, res) => {
    res.status(200).send({ message: `Game server online on port ${server.address().port}` });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`started on port: ${port}`);
});