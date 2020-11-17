
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

  socket.emit('join', yourId);
  socket.on('join', function(userId){
    yourId = userId;

    for(let i = 0; i< userId + 1; i++){
      const rect = new PIXI.Rectangle(0, 0, 64, 64);
      const newTex = new PIXI.Texture(PIXI.loader.resources["spritesheet"].texture, rect);
      playerList.push(new PIXI.Sprite(newTex));
      stage.addChild(playerList[i]);
    }
  });

  socket.on('load', function(players){
    if(players.length > playerList.length){
      for(let i = playerList.length; i< players.length + 1; i++){
        const rect = new PIXI.Rectangle(0, 0, 64, 64);
        const newTex = new PIXI.Texture(PIXI.loader.resources["spritesheet"].texture, rect);
        playerList.push(new PIXI.Sprite(newTex));
        stage.addChild(playerList[i]);
      }
    }
    if(players.length < playerList.length){
      playerList = [];
      stage.removeChildren();
      for(let i = 0; i< players.length + 1; i++){
        const rect = new PIXI.Rectangle(0, 0, 64, 64);
        const newTex = new PIXI.Texture(PIXI.loader.resources["spritesheet"].texture, rect);
        playerList.push(new PIXI.Sprite(newTex));
        stage.addChild(playerList[i]);
      }
    }

    players.forEach((player)=>{
      const {userId} = player;
      playerList[userId].x = player.x;
      playerList[userId].y = player.y;
      
    });
    console.log(playerList);
    renderer.render(stage);
  });

  window.addEventListener("keydown",onKeyDown,false);
  window.addEventListener("keyup",onKeyUp,false);
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
      socket.emit('move', {userId: yourId, x: you.x + vx, y: you.y + vy});
    }

  // a function from Pixi
  requestAnimationFrame(animationLoop);
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

