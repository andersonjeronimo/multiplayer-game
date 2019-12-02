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
            player.y -= 20;
            return;
        },
        ArrowDown(player) {
            player.y += 20;
            return;
        },
        ArrowLeft(player) {
            player.x -= 20;
            return;
        },
        ArrowRight(player) {
            player.x += 20;
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

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    var x = Math.floor((Math.random() * 800) + 1);
    var y = Math.floor((Math.random() * 600) + 1);
    var player = { playerId: socket.id, x, y, color: 'blue' };
    playersState.push(player);
    io.emit('new-state', playersState);

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        var removed = playersState.find(p => p.playerId === socket.id);
        playersState = playersState.filter(p => {
            return p.playerId !== socket.id;
        });
        io.emit('new-state', playersState);
        //io.emit('disconnect-player', removed);
    });

    socket.on('new-command', (command) => {
        movePlayer(command, socket.id);
        var player = playersState.find(p => p.playerId === socket.id);
        io.emit('update-player', player);
    });
    
});

app.get('/status', (req, res) => {
    res.status(200).send({ message: `Game server online on port ${server.address().port}` });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`started on port: ${port}`);
});