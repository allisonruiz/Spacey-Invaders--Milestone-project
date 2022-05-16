const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const PLAYER_WIDTH = 20;
const PLAYER_MAX_SPEED = 600.0;
const LASER_MAX_SPEED = 300.0;
const LASER_COOLDOWN = 1.0;

const ENEMIES_PER_ROW = 10;
const ENEMY_HORIZONTAL_PADDING = 80;
const ENEMY_VERTICAL_PADDING = 70;
const ENEMY_VERTICAL_SPACING = 80;
const ENEMY_COOLDOWN = 5.0;

// //yuh
// var audio = new Audio("sound/Into The Spaceship.mp3");
// audio.play();

const GAME_STATE = {
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    spaceship_width : 50,
    shoot: false,
    lasers: []
};

function rectsIntersect(r1, r2){
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
      );
}


function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px)`;
};
function setSize($element, width){
    $element.style.width = `${width}px`;
    $element.style.height = "auto";
}

function bound(x){
    if(x >= GAME_WIDTH-GAME_STATE.spaceship_width){
        GAME_STATE.playerX = GAME_WIDTH-GAME_STATE.spaceship_width;
        return GAME_STATE.playerX;
    } if (x<=0){
        GAME_STATE.playerX = 0;
        return GAME_STATE.playerX;
    } else {
        return x;
    }
}


function createPlayer($container) {
    GAME_STATE.playerX= GAME_WIDTH/2;
    GAME_STATE.playerY = GAME_HEIGHT-50;
    const $player = document.createElement("img");
    $player.src = "img/spaceship.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function updatePlayer(){
    if (GAME_STATE.move_left){
        GAME_STATE.playerX -= 3;
    } if(GAME_STATE.move_right){
        GAME_STATE.playerX += 3;
    } if(GAME_STATE.shoot){
        createLaser($container, GAME_STATE.playerX - GAME_STATE.spaceship_width/2,GAME_STATE.playerY);
    }
    const $player = document.querySelector(".player");
    setPosition($player, bound(GAME_STATE.playerX), GAME_STATE.playerY);
}

function destroyPlayer($container, player) {
    $container.removeChild(player);
    GAME_STATE.gaveOver = true;
}

const $player = document.querySelector(".player");

function init(){
    const $container = document.querySelector(".game");
    createPlayer($container);
}
  

function createLaser($container, x, y){
    const $element = document.createElement("img");
    $element.src = "img/laser.png";
    $element.className = "laser";
    $container.appendChild($element);
    const laser = {x, y, $element};
    GAME_STATE.lasers.push(laser);
    setPosition($element, x, y);
}

function updateLasers($container) {
    const lasers= GAME_STATE.lasers;
    for (let i = 0; i < lasers.length; i ++){
        const laser = lasers[i];
        laser.y -=2;
        setPosition(laser.$element, laser.x, laser.y);
    }
}


function onKeyDown(event){
    if(event.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.move_right = true;
        console.log("Right key is pressed");
    } else if(event.keyCode === KEY_CODE_LEFT){
        GAME_STATE.move_left = true;
        console.log("left key is pressed");
    } else if (event.keyCode === KEY_CODE_SPACE){
        GAME_STATE.shoot = true;
    }
}
function onKeyUp(event){
    if(event.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.move_right = false;
    } else if(event.keyCode === KEY_CODE_LEFT){
        GAME_STATE.move_left = false;
    } else if (event.keyCode === KEY_CODE_SPACE){
        GAME_STATE.shoot = false;
    }
}

const $container = document.querySelector(".game");
createPlayer($container);


function update(){
    updatePlayer();
    updateLasers($container);
    window.requestAnimationFrame(update);
}

init();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);


update();