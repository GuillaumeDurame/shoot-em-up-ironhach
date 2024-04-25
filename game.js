const gameArea = document.querySelector('#game-area');
const playerShip = document.querySelector('#player-ship');
const gameOverScreen = document.querySelector('#game-over');
const scoreDisplay = document.querySelector('#score');
let score = 0;
let bullets = [];
let enemies = [];
let intervaleId1 = null;
let intervaleId2 = null;

// position joueur
let playerX = gameArea.clientWidth / 2;

// deplacement joueur 
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        playerShip.classList.add("turnLeft")
        playerX = Math.max(playerX - 10, 10);
    } else if (e.key === 'ArrowRight') {
        playerShip.classList.add("turnRight");
        playerX = Math.min(playerX + 10, gameArea.clientWidth - 10); 
    }
    playerShip.style.left = playerX + 'px';
});
window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        playerShip.classList.remove("turnLeft");
    } else if (e.key === 'ArrowRight') {
        playerShip.classList.remove("turnRight");
    }
})

// creation d'ennemie
function createEnemyShip() {
    const enemyShip = document.createElement('div');
    enemyShip.className = 'enemy-ship';
    enemyShip.style.left = Math.random() * (gameArea.clientWidth - 20) + 'px';
    gameArea.appendChild(enemyShip);
    enemies.push(enemyShip);

    // deplacement ennemie
    /*setInterval(() => {
        const topPos = parseInt(enemyShip.style.top) || 0;
        enemyShip.style.top = topPos + 5 + 'px';

        // check collision avec le joueur 
        if (topPos >= gameArea.clientHeight - 20) {
            gameOver();
        }
    }, 100);*/

}

// cree ennemie toute les 2sec
function gameStart(){
    intervaleId2 = setInterval(createEnemyShip, 2000);
    intervaleId1 = setInterval(gameUpdate, 20);
}


function gameUpdate(){
    enemies.forEach( enemyShip => {
        const topPos = parseInt(enemyShip.style.top) || 0;
        enemyShip.style.top = topPos + 5 + 'px';
        if (topPos >= gameArea.clientHeight - 20) {
            gameOver();
        };
    });
    bullets.forEach(bullet => {
        const bulletIndex = bullets.indexOf(bullet)
        const bottomPos = parseInt(bullet.style.bottom) || 0;
            bullet.style.bottom = bottomPos + 5 + 'px';
            if(bottomPos >= gameArea.clientHeight - 10){
                bullet.remove();
                bullets.splice(bulletIndex, 1);
            };

            // collision avec les ennemies
            enemies.forEach((enemy, i) => {
                if (checkCollision(bullet, enemy)) {
                    bullet.remove();
                    setTimeout(()=>{
                        enemy.remove();   
                    },1000)
                    enemy.classList.add("exploding")
                    bullets.splice(bulletIndex, 1);
                    enemies.splice(i, 1);
                    score++;
                    scoreDisplay.textContent = score;
                    /*quand l'enemie est toucher on rajoute une classe enemy.classlist.add puis la classe de l'explosion puis garder le splice du bullet et de l'enemy
                    */
            }});
        
    });    
}

// tir 
window.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.style.left = playerX + 'px';
        bullet.style.bottom = '20px';
        gameArea.appendChild(bullet);
        bullets.push(bullet)

        // traj du projectil 
       /* setInterval(() => {
            const bottomPos = parseInt(bullet.style.bottom) || 0;
            bullet.style.bottom = bottomPos + 5 + 'px';

            // collision avec les ennemies
            const enemies = document.querySelectorAll('.enemy-ship');
            enemies.forEach((enemy) => {
                if (checkCollision(bullet, enemy)) {
                    enemy.remove();
                    bullet.remove();
                    score++;
                    scoreDisplay.textContent = score;
                }
            });
        }, 100);*/
    }
});

// collision entre 2 elements
function checkCollision(a, b) {
    const aElement = a.getBoundingClientRect();
    const bElement = b.getBoundingClientRect();
    return !(aElement.right < bElement.left || aElement.left > bElement.right || aElement.bottom < bElement.top || aElement.top > bElement.bottom);
}

gameStart();

function gameOver() {
    gameOverScreen.style.display = 'block';
    clearInterval(intervaleId1);
    clearInterval(intervaleId2);

}
document.querySelector('#restart').addEventListener('click', (e) => {
    restartGame();
})

function restartGame() {
    // location.reload();
    // const enemies = document.querySelectorAll('.enemy-ship');
    enemies.forEach((enemy) => {
        enemy.remove();
    });
    bullets.forEach((bullet) => {
        bullet.remove();
    });

    enemies = [];
    bullets = [];

    playerX = gameArea.clientWidth / 2;
    playerShip.style.left = playerX + 'px';
    score = 0;
    scoreDisplay.textContent = score;

    gameOverScreen.style.display = 'none';
    gameStart();
}


 