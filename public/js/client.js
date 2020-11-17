
const renderer = PIXI.autoDetectRenderer(1280, 720, {
  transparent: true,
  resolution: 1
});

const stage = new PIXI.Container();

//전역변수
let yourId = -1;
let socket;
let playerList = [];
const keyDown = [];

const setup = function(){
  socket = io();

  socket.on('test', (test)=>{
    console.log(test);
  });

  socket.emit('init', yourId);
  socket.on('init', function(userId){
    yourId = userId;

    for(let i = 0; i < userId + 1; i++){
      const rect = new PIXI.Rectangle(0, 0, 64, 64);
      const newTex = new PIXI.Texture(PIXI.loader.resources["spritesheet"].texture, rect);
      playerList.push(new PIXI.Sprite(newTex));
      stage.addChild(playerList[i]);
    }
  });

  socket.on('join', function(info){
      const rect = new PIXI.Rectangle(0, 0, 64, 64);
      const newTex = new PIXI.Texture(PIXI.loader.resources["spritesheet"].texture, rect);
      playerList.push(new PIXI.Sprite(newTex));
      stage.addChild(playerList[info.userId]);
  });

  socket.on('move', function(playerInfo){
    const {userId, x, y} = playerInfo;
    playerList[userId].x = x;
    playerList[userId].y = y;
  });

  window.addEventListener("keydown",onKeyDown,false);
  window.addEventListener("keyup",onKeyUp,false);
  window.addEventListener("beforeunload", function (event) {
    socket.emit('leave', yourId);
  }.bind(socket));
  function onKeyDown(e){
    keyDown[e.keyCode] = true;
  }
  function onKeyUp(e){
    keyDown[e.keyCode] = false;
  }

  function wait(msecs)
  {
    var start = new Date().getTime();
    var cur = start;
    while(cur - start < msecs)
    {
    cur = new Date().getTime();
    }
  }
  animationLoop();
};

// helper function 
function animationLoop() {
    const you = playerList[yourId];
    let vx = 0;
    let vy = 0;
    if(keyDown[38]){
      vy = -10
    }
    if(keyDown[37]){ 
        vx = -10;
    }
    if(keyDown[40]){ 
        vy = 10;
    }
    if(keyDown[39]){ 
        vx = 10;
    }
    if(keyDown[37] || keyDown[38] || keyDown[39] || keyDown[40]){
      playerList[yourId].x += vx;
      playerList[yourId].y += vy;
      socket.emit('move', {userId: yourId, x: you.x + vx, y: you.y + vy});
    }

  // a function from Pixi
  requestAnimationFrame(animationLoop);
  renderer.render(stage);
};

//window.addEventListener("load",setup);

//Create a Pixi Application
let app = new PIXI.Application({width: 1280, height: 720});
// load the spritesheet, first arg could name anything you want
// second arg will be the path of the png file
PIXI.loader
  .add("spritesheet", "asset/BODY_skeleton.png")
  .load(setup);

//Add the canvas that Pixi automatically created for you to the HTML document
const displayDiv = document.querySelector('#display')
displayDiv.appendChild(renderer.view);

