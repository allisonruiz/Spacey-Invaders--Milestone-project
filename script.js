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


const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed:false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    gaveOver:false
};

function rectsIntersect(r1, r2){
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
      );
}


function setPosition(el, x, y) {
    el.style.transform = `translate(${x}px, ${y}px)`;
};


function createPlayer($container) {
    GAME_STATE.playerX= GAME_WIDTH/2;
    GAME_STATE.playerY = GAME_HEIGHT-50;
    const $player = document.createElement("img");
    $player.src = "img/spaceship.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function destroyPlayer($container, player) {
    $container.removeChild(player);
    GAME_STATE.gaveOver = true;
}

function updatePlayer(dt, $container){
    if(GAME_STATE.leftPressed){
        GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
    } if(GAME_STATE.rightPressed){
        GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;
    }

    const $player = document.querySelector(".player");
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);  
}

function onKeyDown(event){
    if(event.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.move_right = true;
    } else if(event.keyCode === KEY_CODE_LEFT){
        GAME_STATE.move_left = true;
    }
}
function onKeyUp(event){
    if(event.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.move_right = false;
    } else if(event.keyCode === KEY_CODE_LEFT){
        GAME_STATE.move_left = false;
    }
}
function init() {
    const $container = document.querySelector(".game");
    createPlayer($container);
}

function update(){
    updatePlayer();
    window.requestAnimationFrame(update);
}


init();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(update);

update();