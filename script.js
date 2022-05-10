const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

const GAME_WIDTH = 900;
const GAME_HEIGHT = 700;

const PLAYER_WIDTH = 20;
const PLAYER_MAX_SPEED = 600.0;
const LASER_MAX_SPEED = 300.0;
const LASER_COOLDOWN = 1.0;

const enemiesPerRow = 10;
const enemyHorizontalPadding = 80;
const enemyVerticalPadding = 70;
const enemyVerticalSpacing = 80;
const enemyCoolDown = 1.0;


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

function rectsIntersect(r1, r2) {
    return !(
        r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}

function setPosition(el, x, y) {
    el.style.transform = `translate(${x}px, ${y}px)`;
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

function rand(min, max) {
    if (min === undefined) min = 0;
    if (max === undefined) max = 1;
    return min + Math.random() * (max - min);
}

function createPlayer($container) {
    gameState.playerX = GAME_WIDTH / 2;
    gameState.playerY = GAME_HEIGHT - 50;
    const $player = document.createElement("img");
    $player.src = "assets/player.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, gameState.playerX, gameState.playerY);
}
