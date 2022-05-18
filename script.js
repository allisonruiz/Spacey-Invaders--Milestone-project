const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 740;
const GAME_HEIGHT = 600;

const PLAYER_WIDTH = 32;
const PLAYER_MAX_SPEED = 600.0;
const LASER_MAX_SPEED = 300.0;
const LASER_COOLDOWN = 1.0;

const ENEMIES_PER_ROW = 10;
const ENEMY_HORIZONTAL_PADDING = 80;
const ENEMY_VERTICAL_PADDING = 70;
const ENEMY_VERTICAL_SPACING = 80;
const ENEMY_COOLDOWN = 40.0;


// //yuh
const audio = new Audio("sound/Into The Spaceship.mp3");
audio.play();
audio.volume = 0.3;

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
    enemyLasers: [],
    cooldown: 0,
    number_of_enemies: 16,
    enemy_cooldown: 0,
    gameOver: false,
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


function clamp(v, min, max) {
    if (v < min) {
      return min;
    } else if (v > max) {
      return max;
    } else {
      return v;
    }
  }

  function rand(min, max){
      if (min === undefined) min = 0;
      if (max === undefined) max = 1;
      return min + Math.random() * (max - min);
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

function updatePlayer(dt, $container){
    if (GAME_STATE.move_left){
        //GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
        GAME_STATE.playerX -= 3
        console.log(GAME_STATE.playerX)
    } if(GAME_STATE.move_right){
        //GAME_STATE.playerX += dt *PLAYER_MAX_SPEED;
        GAME_STATE.playerX += 3
        
    }
    GAME_STATE.playerX = clamp(
        GAME_STATE.playerX,
        PLAYER_WIDTH,
        GAME_WIDTH,
        GAME_WIDTH - PLAYER_WIDTH
    );

    if(GAME_STATE.shoot && GAME_STATE.cooldown <= 0){
        createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
        GAME_STATE.cooldown = LASER_COOLDOWN;
    };
    if(GAME_STATE.cooldown > 0){
        GAME_STATE.cooldown -= dt;
    }
    const player = document.querySelector(".player");
    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function destroyPlayer($container, player) {
    $container.removeChild(player);
    GAME_STATE.gameOver = true;
}

//lasers
function createLaser($container, x, y){
    const $element = document.createElement("img");
    $element.src = "img/laser.png";
    $element.className = "laser";
    $container.appendChild($element);
    console.log($element);
    const laser = {x, y, $element};
    GAME_STATE.lasers.push(laser);
    setPosition($element, x, y);
}

function updateLasers(dt, $container) {
    const lasers= GAME_STATE.lasers;
    for (let i = 0; i < lasers.length; i ++){
        const laser = lasers[i];
        laser.y -= dt * LASER_MAX_SPEED;
        if(laser.y < 0){
            deleteLaser($container, laser);
        }
        setPosition(laser.$element, laser.x, laser.y);
        const r1 = laser.$element.getBoundingClientRect();
        const enemies = GAME_STATE.enemies;
        for(let j=0; j<enemies.length; j++){
            const enemy = enemies[j];
            if (enemy.isDead) continue;
            const r2 = enemy.$enemy.getBoundingClientRect();
            if(rectsIntersect(r1, r2)){
                deleteLaser($container, laser);
                destroyEnemy($container, enemy);
            }
        }
    }
    GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}

function deleteLaser($container, laser){
    $container.removeChild(laser.$element);
    laser.isDead = true;
}

//Enemies
function createEnemy($container, x, y){
    const $enemy = document.createElement("img");
    $enemy.src = "img/enemy.png";
    $enemy.className = "enemy";
    $container.appendChild($enemy);
    const enemy_cooldown = Math.floor(Math.random()*100);
    const enemny ={x, y, $enemy, enemy_cooldown};
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
        if(enemy.enemy_cooldown == 0){
            createEnemyLaser($container, a, b);
            enemy.enemy_cooldown= Math.floor(Math.random()*50)+100;
        }
        enemy.enemy_cooldown -= 0.5;
    }
}

function createEnemies($container){
    for(let i = 0; i<= GAME_STATE.number_of_enemies/2;i++){
        createEnemy($container, i*80, 100);
    } for(let i = 0; i<GAME_STATE.number_of_enemies/2;i++){
        createEnemy($container, i*80, 180);
    }
}

function destroyEnemy($container, enemy){
    $container.removeChild(enemy.$enemy);
    enemy.isDead = true;
}

//enemy lasers
function createEnemyLaser($container, x, y){
    const $element = document.createElement("img");
    $element.src = "img/laser-bolts.png";
    $element.className = "enemyLaser";
    $container.appendChild($element);
    const laser = {x, y, $element};
    GAME_STATE.enemyLasers.push(laser);
    setPosition($element, x, y);
}

function updateEnemyLasers(dt, $container){
    const lasers = GAME_STATE.enemyLasers;
    for(let i = 0; i < lasers.length; i++){
        const laser = GAME_STATE.enemyLasers[i];
        laser.y += dt * LASER_MAX_SPEED;
        if(laser.y > GAME_HEIGHT){
            deleteLaser($container, laser);
        }
        setPosition(laser.$element, laser.x, laser.y);
        const r1 = laser.$element.getBoundingClientRect();
        const player = document.querySelector(".player");
        const r2 = player.getBoundingClientRect();
        if(rectsIntersect(r1, r2)){
            console.log("Game over");
            destroyPlayer($container, player);
            break;
        }
    }
    GAME_STATE.enemyLasers = GAME_STATE.enemyLasers.filter(e => !e.isDead);
}

function init(){
    const $container = document.querySelector(".game");
    createPlayer($container);
}

const $container = document.querySelector(".game");
createEnemies($container);

//update function
function update(){
    const currentTime = Date.now();
    const dt = (currentTime - GAME_STATE.lastTime) / 1000.0;

    const $container= document.querySelector(".game");
    // const $container = document.getElementsByClassName("game");
    updatePlayer(dt, $container);
    updateLasers(dt, $container);
    updateEnemies(dt, $container);
    updateEnemyLasers(dt, $container);

    GAME_STATE.lastTime = currentTime;
    window.requestAnimationFrame(update);

    if (GAME_STATE.gameOver){
        document.querySelector(".game-over").style.display = "block";
        return;
    } if (GAME_STATE.enemies.length == 0){
        document.querySelector(".congratulations").style.display = "block";
        return;
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

init();
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(update);
