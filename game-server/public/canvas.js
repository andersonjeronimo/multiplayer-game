var socket = io('http://localhost:3000');

var canvas = document.querySelector('canvas');
canvas.width = 800;//window.innerWidth;
canvas.height = 600;//window.innerHeight;

var context = canvas.getContext('2d');

var players = [];

document.addEventListener('keyup', (event) => {
    const command = {
        key: event.key,
        keyCode: event.keyCode
    }
    socket.emit('new-command', command);
});

requestAnimationFrame(renderScreen);

function renderScreen() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);   
    this.players.forEach(player => {
        this.context.fillStyle = player.color;
        this.context.fillRect(player.x, player.y, 20, 20);
    });
    requestAnimationFrame(renderScreen);
}

socket.on('new-state', (state) => {
   players = state;   
});

socket.on('update-player', (player) => {    
    players.map(p => {
        p.playerId === player.playerId ? Object.assign(p, player) : p;
    });
});

socket.on('disconnect-player', (player) => {
    players = players.filter(p => {
        return p.playerId !== player.playerId;
    });
});