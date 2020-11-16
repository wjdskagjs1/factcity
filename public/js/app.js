PIXI.utils.sayHello(); // the code from Step 3, you can leave it
// create a canvas for all of your game elements
const renderer = PIXI.autoDetectRenderer(512, 512, {
  transparent: true,
  resolution: 1
});
const displayDiv = document.querySelector('#display')
displayDiv.appendChild(renderer.view);
const stage = new PIXI.Container();

// lets continue our code
// load the spritesheet, first arg could name anything you want
// second arg will be the path of the png file
PIXI.loader
  .add("spritesheet", "asset/BODY_skeleton.png")
  .load(setup);

var sprite; // given a global variable, we will be using it 
let rect;

function setup() {
  stage.interactive = true;
  // set a rectangle frame for skeleton spritesheet 
  // (x, y, height, width)
  rect = new PIXI.Rectangle(0, 0, 64, 64);
  const texture = PIXI.loader.resources["spritesheet"].texture;
  texture.frame = rect;
  sprite = new PIXI.Sprite(texture);

  // highly recommend to use scale to change frame size
  sprite.scale.set(2, 2); 
  // these two lines are for eventlistener later
  sprite.vx = 10;
  sprite.vy = 10;
  stage.addChild(sprite); // add sprite to stage area

  window.addEventListener("keydown",onKeyDown,false);
  window.addEventListener("keyup",onKeyUp,false);
    function onKeyDown(e){ 
        isKeyDown[e.keyCode] = true;
    }
    function onKeyUp(e){
        isKeyDown[e.keyCode] = false;
    }
  animationLoop(); // from below helper function
}

var isKeyDown = [];


// helper function 
function animationLoop() {
    const UP = 38,
    DOWN = 40,
    LEFT = 37,
    RIGHT = 39;

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

  // a function from Pixi
  requestAnimationFrame(animationLoop);
  renderer.render(stage);

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
