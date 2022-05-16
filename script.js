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
    spaceship_width : 50
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
    }
    const $player = document.querySelector(".player");
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function destroyPlayer($container, player) {
    $container.removeChild(player);
    GAME_STATE.gaveOver = true;
}

const $player = document.querySelector(".player");
  

function createLaser($container, x, y){
    const $element = document.createElement("img");
    $element.src = "img/laser.png";
    $element.className = "laser";
    $container.appendChild($element);
    setPosition($element, x, y);
}

function updateLasers(dt, $container) {
    const lasers= GAME_STATE.lasers;
    for (let i = 0; i <lasers.length; i ++){
        const laser = lasers[i];
        laser.y -= dt * LASER_MAX_SPEED;
        if (laser.y <0){
            destroyLaser($container, laser);
        }
        setPosition(laser.$element, laser.x, laser.y);
        const r1 = laser.$element.getBoundingClientRect();
        const enemies = GAME_STATE.enemies;
        for (let j= 0; j < enemies.length; j ++) {
            const enemy = enemies[j];
            if (enemy.isDead) continue;
            const r2 = enemy.$element.getBoundingClientRect();
            if (rectsIntersect(r1, r2)) {
              destroyEnemy($container, enemy);
              destroyLaser($container, laser);
              break;
        }
    }
}
}
function destroyLaser($container, laser) {
    $container.removeChild(laser.$element);
    laser.isDead = true;
  }
  

function onKeyDown(event){
    if(event.keyCode === KEY_CODE_RIGHT){
        GAME_STATE.move_right = true;
        console.log("Right key is pressed");
    } else if(event.keyCode === KEY_CODE_LEFT){
        GAME_STATE.move_left = true;
        console.log("left key is pressed");
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