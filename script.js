const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 900;
const GAME_HEIGHT = 700;

const PLAYER_WIDTH = 20;
const PLAYER_MAX_SPEED = 600.0;
const LASER_MAX_SPEED = 300.0;
const LASER_COOLDOWN = 1.0;


const gameState = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed:false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    gaveOver:false
};
