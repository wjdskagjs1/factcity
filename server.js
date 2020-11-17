const express = require('express');
const fs = require('fs');
const { emit } = require('process');
const app = express();
const server  = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static('public'));

let playerList = [];
const speed = 10;

io.on("connection", async function(socket) {
    socket.on('init', (userId) => {
        playerList.push({userId:playerList.length, x:0, y:0});
        const newId = playerList.length - 1;

        socket.emit('init', newId);
        socket.broadcast.emit('join', playerList[newId]);
        
    });
    socket.on('move', (info) => {
        const {userId, x, y} = info;
        
        if(userId < 0) return;
        playerList[userId].x = x;
        playerList[userId].y = y;
        socket.broadcast.emit('move', playerList[userId]);
    });

    socket.on('leave', (userId)=>{
        playerList.splice(userId, 1);
    });
});

server.listen(3000, function(){
    console.log("서버 실행중")
});