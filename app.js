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
    await socket.on('join', (userId) => {
        if(userId < 0){
            playerList.push({userId:-1, x:0, y:0});
            playerList[playerList.length - 1].userId = playerList.length - 1;
            socket.emit('join', playerList.length - 1);
        }
    });
    const loadInterval = setInterval(()=>{
        io.emit('load', playerList);
    }, 10);

    socket.on('move', (info) => {
        const {userId, x, y} = info;
        
        if(userId < 0) return;
        playerList[userId].x = x;
        playerList[userId].y = y;
    });
});

server.listen(3000, function(){
    console.log("서버 실행중")
});