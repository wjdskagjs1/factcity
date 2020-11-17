
const renderer = PIXI.autoDetectRenderer(512, 512, {
  transparent: true,
  resolution: 1
});
const stage = new PIXI.Container();

//전역변수
let userId = 0;
let socket;
let isKeyDown = [];


const setup = function(){

  socket = io();
  socket.emit('newPlayer', userId);

  window.addEventListener("keydown",onKeyDown,false);
  window.addEventListener("keyup",onKeyUp,false);
    function onKeyDown(e){ 
        isKeyDown[e.keyCode] = true;
    }
    function onKeyUp(e){
        isKeyDown[e.keyCode] = false;
    }
  animationLoop();

  // helper function 
  function animationLoop() {
    const UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39;

    const rect = PIXI.Rectangle(0, 0, 64, 64);
    const texture = PIXI.loader.resources["spritesheet"].texture;
    texture.frame = rect;
    const sprite = PIXI.Sprite(texture);

    if(isKeyDown[UP]){
        rect.y = 0 * 64;
        sprite.y -= sprite.vy;
    }
    if(isKeyDown[LEFT]){ 
        rect.y = 1 * 64;
        sprite.x -= sprite.vx;
    }
    if(isKeyDown[DOWN]){ 
        rect.y = 2 * 64;
        sprite.y += sprite.vy;
    }
    if(isKeyDown[RIGHT]){ 
        rect.y = 3 * 64;
        sprite.x += sprite.vx;
    }
    if(isKeyDown[UP] || isKeyDown[LEFT] || isKeyDown[DOWN] || isKeyDown[RIGHT]){
        if (rect.x >= 64 * 4) rect.x = 0;
        sprite.texture.frame = rect;
        rect.x += 64;
        wait(40);
    }

    socket.emit('savePlayer', {userId:userId, player:{rect:rect, sprite:sprite}});

    socket.on('loadPlayers', function(players){
      players.forEach(function (player) {
        console.log(player);
      });
      renderer.render(stage);
    });

    // a function from Pixi
    requestAnimationFrame(animationLoop);
  };  

  function wait(msecs)
  {
    var start = new Date().getTime();
    var cur = start;
    while(cur - start < msecs)
    {
    cur = new Date().getTime();
    }
  }
};

//Create a Pixi Application
let app = new PIXI.Application({width: 1280, height: 720});
// load the spritesheet, first arg could name anything you want
// second arg will be the path of the png file
PIXI.loader
  .add("spritesheet", "asset/BODY_skeleton.png")
  .load(setup);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

