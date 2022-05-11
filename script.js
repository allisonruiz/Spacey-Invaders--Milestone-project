const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 900;
const GAME_HEIGHT = 700;

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


function rectsIntersect(r1, r2) {
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

function setSize($element, x, y){
    $element.style.width = `${width}px`;
    $element.style.height = "auto";
}

function createPlayer($container) {
    GAME_STATE.x_pos= GAME_WIDTH/2;
    GAME_STATE.y_pos = GAME_HEIGHT-50;
    const $player = document.createElement("img");
    $player.src = "img/Player.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, GAME_STATE.x_pos, GAME_STATE.y_pos);
    setSize($player, GAME_STATE.spaceship_width);
}
function destroyPlayer($container, player) {
    $container.removeChild(player);
    GAME_STATE
}
function updatePlayer(){
    if(GAME_STATE.move_left){
        GAME_STATE.x_pos -= 3;
    } if(GAME_STATE.move_right){
        GAME_STATE.x_pos += 3;
    }

}

const $player = document.querySelector(".player");
setPosition($player, GAME_STATE.x_pos, GAME_STATE.y_pos);

function keyPress(event){
    if(event.keyCode === KEY_RIGHT){
        GAME_STATE.move_right = true;
    } else if(event.keyCode === KEY_LEFT){
        GAME_STATE.move_left = true;
    }
}
function keyRelease(event){
    if(event.keyCode === KEY_RIGHT){
        GAME_STATE.move_right = false;
    } else if(event.keyCode === KEY_LEFT){
        GAME_STATE.move_left = false;
    }
}

function update(){
    updatePlayer()
}


const $container = document.querySelector(".main");
createPlayer($container);

window.addEventListener("keydown", keyPress);
window.addEventListener("keyup", keyRelease);


