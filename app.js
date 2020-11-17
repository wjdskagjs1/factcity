var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);

let playerList = [];

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('newPlayer', async (userId) => {

        const PIXI = require('pixi-shim');
        // set a rectangle frame for skeleton spritesheet 
        // (x, y, height, width)

        PIXI.add("spritesheet", "asset/BODY_skeleton.png");

        const rect = PIXI.Rectangle(0, 0, 64, 64);
        const {texture} = PIXI.loader.resources["spritesheet"];
        texture.frame = rect;
        const sprite = PIXI.Sprite(texture);

        // highly recommend to use scale to change frame size
        sprite.scale.set(2, 2); 
        // these two lines are for eventlistener later
        sprite.vx = 10;
        sprite.vy = 10;
        playerList[userId] = {rect:rect, sprite:sprite};
    });


    socket.on('savePlayer', (user) => {
        playerList[user.userId] = user.player;
    });
    
    io.emit('loadPlayers', playerList);
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});

module.exports = app;
