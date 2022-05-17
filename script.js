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
    enemy_width: 50,
    shoot: false,
    lasers: [],
    enemies: [],
    cooldown: 0,
    number_of_enemies: 16,
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

function deleteLaser(lasers, laser, $element){
    const index = lasers.indexOf(laser);
    lasers.splice(index, 1);
    $container.removeChild($element);
}

function collideRect(rect1, rect2){
    return!(rect2.left>rect1.right||
        rect2.right < rect1.left ||
        rect2.top> rect1.bottom||
        rect2.bottom < rect1.top);
}

//player

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
    } if(GAME_STATE.shoot && GAME_STATE.cooldown == 0){
        createLaser($container, GAME_STATE.playerX - GAME_STATE.spaceship_width/2,GAME_STATE.playerY);
        GAME_STATE.cooldown = 30;
    }
    const $player = document.querySelector(".player");
    setPosition($player, bound(GAME_STATE.playerX), GAME_STATE.playerY-10);
    if(GAME_STATE.cooldown > 0){
        GAME_STATE.cooldown -= 0.5;
    }
    console.log(GAME_STATE.cooldown);
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
  
//lasers
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
        if(laser.y < 0){
            deleteLaser(lasers, laser, laser.$element);
        }
        setPosition(laser.$element, laser.x, laser.y);
        const laser_rectangle = laser.$element.getBoundingClientRect();
        const enemies = GAME_STATE.enemies;
        for(let j=0; j<enemies.length; j++){
            const enemy = enemies[j];
            const enemy_rectangle = enemy.$enemy.getBoundingClientRect();
            if(collideRect(enemy_rectangle, laser_rectangle)){
                deleteLaser(lasers, laser, laser.$element);
                const index = enemies.indexOf(enemy);
                enemies.splice(index,1);
                $container.removeChild(enemy.$enemy);
            }
        }
    }
}

//Enemies
function createEnemy($container, x, y){
    const $enemy = document.createElement("img");
    $enemy.src = "img/enemy.png";
    $enemy.className = "enemy";
    $container.appendChild($enemy);
    const enemny ={x, y, $enemy}
    GAME_STATE.enemies.push(enemny);
    setSize($enemy, GAME_STATE.enemy_width);
    setPosition($enemy, x, y);
}

function updateEnemies(){
    const dx = Math.cos(Date.now()/1000)*40;
    const dy = Math.cos(Date.now()/1000)*30;
    const enemies = GAME_STATE.enemies;
    for(let i = 0; i<enemies.length; i++){
        const enemy = enemies[i];
        var a = enemy.x + dx;
        var b = enemy.y + dy;
        setPosition(enemy.$enemy, a, b);
    }
}

function createEnemies($container){
    for(let i = 0; i<= GAME_STATE.number_of_enemies/2;i++){
        createEnemy($container, i*80, 100);
    } for(let i = 0; i<GAME_STATE.number_of_enemies/2;i++){
        createEnemy($container, i*80, 180);
    }
}

//Arrow keys
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
createEnemies($container);

//update function
function update(){
    updatePlayer();
    updateLasers($container);
    updateEnemies();
    window.requestAnimationFrame(update);
}

init();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);


update();