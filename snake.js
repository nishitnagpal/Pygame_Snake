const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const cellSize = 20;
const cellNumber = 30;
const width = canvas.width;
const height = canvas.height;

const FPS = 5;  // Set the game speed (frames per second)
const interval = 1000 / FPS;  // Calculate the interval in milliseconds

let apple = new Image();
apple.src = 'Graphics/apple.png';

let headUp = new Image();
headUp.src = 'Graphics/head_up.png';
let headDown = new Image();
headDown.src = 'Graphics/head_down.png';
let headRight = new Image();
headRight.src = 'Graphics/head_right.png';
let headLeft = new Image();
headLeft.src = 'Graphics/head_left.png';

let tailUp = new Image();
tailUp.src = 'Graphics/tail_up.png';
let tailDown = new Image();
tailDown.src = 'Graphics/tail_down.png';
let tailRight = new Image();
tailRight.src = 'Graphics/tail_right.png';
let tailLeft = new Image();
tailLeft.src = 'Graphics/tail_left.png';

let bodyVertical = new Image();
bodyVertical.src = 'Graphics/body_vertical.png';
let bodyHorizontal = new Image();
bodyHorizontal.src = 'Graphics/body_horizontal.png';

let bodyTr = new Image();
bodyTr.src = 'Graphics/body_tl.png';
let bodyTl = new Image();
bodyTl.src = 'Graphics/body_tr.png';
let bodyBr = new Image();
bodyBr.src = 'Graphics/body_bl.png';
let bodyBl = new Image();
bodyBl.src = 'Graphics/body_br.png';

let crunchSound = new Audio('Sound/crunch.wav');

class Snake {
    constructor() {
        this.body = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }];
        this.direction = { x: 0, y: 0 };
        this.newBlock = false;
        this.head = headRight;
        this.tail = tailLeft;
    }

    draw() {
        this.updateHeadGraphics();
        this.updateTailGraphics();

        for (let i = 0; i < this.body.length; i++) {
            let block = this.body[i];
            let x = block.x * cellSize;
            let y = block.y * cellSize;
            if (i === 0) {
                ctx.drawImage(this.head, x, y, cellSize, cellSize);
            } else if (i === this.body.length - 1) {
                ctx.drawImage(this.tail, x, y, cellSize, cellSize);
            } else {
                let prevBlock = this.body[i + 1];
                let nextBlock = this.body[i - 1];
                if (prevBlock.x === nextBlock.x) {
                    ctx.drawImage(bodyVertical, x, y, cellSize, cellSize);
                } else if (prevBlock.y === nextBlock.y) {
                    ctx.drawImage(bodyHorizontal, x, y, cellSize, cellSize);
                } else {
                    if ((prevBlock.x === block.x + 1 && nextBlock.y === block.y - 1) || (nextBlock.x === block.x + 1 && prevBlock.y === block.y - 1)) {
                        ctx.drawImage(bodyTl, x, y, cellSize, cellSize);
                    } else if ((prevBlock.x === block.x + 1 && nextBlock.y === block.y + 1) || (nextBlock.x === block.x + 1 && prevBlock.y === block.y + 1)) {
                        ctx.drawImage(bodyBl, x, y, cellSize, cellSize);
                    } else if ((prevBlock.x === block.x - 1 && nextBlock.y === block.y - 1) || (nextBlock.x === block.x - 1 && prevBlock.y === block.y - 1)) {
                        ctx.drawImage(bodyTr, x, y, cellSize, cellSize);
                    } else if ((prevBlock.x === block.x - 1 && nextBlock.y === block.y + 1) || (nextBlock.x === block.x - 1 && prevBlock.y === block.y + 1)) {
                        ctx.drawImage(bodyBr, x, y, cellSize, cellSize);
                    }
                }
            }
        }
    }

    updateHeadGraphics() {
        let headRelation = { x: this.body[1].x - this.body[0].x, y: this.body[1].y - this.body[0].y };
        if (headRelation.x === 1 && headRelation.y === 0) this.head = headLeft;
        if (headRelation.x === -1 && headRelation.y === 0) this.head = headRight;
        if (headRelation.x === 0 && headRelation.y === 1) this.head = headUp;
        if (headRelation.x === 0 && headRelation.y === -1) this.head = headDown;
    }

    updateTailGraphics() {
        let tailRelation = { x: this.body[this.body.length - 2].x - this.body[this.body.length - 1].x, y: this.body[this.body.length - 2].y - this.body[this.body.length - 1].y };
        if (tailRelation.x === 1 && tailRelation.y === 0) this.tail = tailLeft;
        if (tailRelation.x === -1 && tailRelation.y === 0) this.tail = tailRight;
        if (tailRelation.x === 0 && tailRelation.y === 1) this.tail = tailUp;
        if (tailRelation.x === 0 && tailRelation.y === -1) this.tail = tailDown;
    }

    move() {
        if (this.newBlock) {
            this.body = [{ x: this.body[0].x + this.direction.x, y: this.body[0].y + this.direction.y }, ...this.body];
            this.newBlock = false;
        } else {
            this.body = [{ x: this.body[0].x + this.direction.x, y: this.body[0].y + this.direction.y }, ...this.body.slice(0, -1)];
        }
    }

    addBlock() {
        this.newBlock = true;
    }

    playCrunchSound() {
        crunchSound.play();
    }

    reset() {
        this.body = [{ x: 5, y: 10 }, { x: 4, y: 10 }, { x: 3, y: 10 }];
        this.direction = { x: 0, y: 0 };
    }
}

class Fruit {
    constructor() {
        this.randomize();
    }

    draw() {
        let x = this.pos.x * cellSize;
        let y = this.pos.y * cellSize;
        ctx.drawImage(apple, x, y, cellSize, cellSize);
    }

    randomize() {
        this.pos = {
            x: Math.floor(Math.random() * (cellNumber - 2)),
            y: Math.floor(Math.random() * (cellNumber - 2)) + 2
        };
    }
}

class Game {
    constructor() {
        this.snake = new Snake();
        this.fruit = new Fruit();
        this.startTime = 0;
        this.elapsedTime = 0;
        this.finalTime = 0;
        this.paused = false;
        this.gameStarted = false;
        this.endStatus = false;
        this.score = 0;
        this.lastTime = 0;  // Add lastTime to track the last update time
    }

    update(delta) {
        if (this.gameStarted && !this.paused && !this.endStatus) {
            this.snake.move();
            this.checkCollision();
            this.checkFail();
        }
    }

    draw() {
        this.drawGrass();
        if (this.gameStarted && !this.endStatus) {
            this.drawTimer();
        }
        if (this.gameStarted) {
            if (!this.paused) {
                this.fruit.draw();
                this.snake.draw();
                this.drawScore();
                /*this.drawTimer();*/
                this.timeOver();
            }
            else {
                this.drawPauseMessage();
            }
            if (this.endStatus) {
                this.drawLostMessage();
                
            }
        } else {
            this.drawStartMessage();
        }
    }

    checkCollision() {
        if (this.snake.body[0].x === this.fruit.pos.x && this.snake.body[0].y === this.fruit.pos.y) {
            this.fruit.randomize();
            this.snake.addBlock();
            this.snake.playCrunchSound();
        }

        for (let block of this.snake.body.slice(1)) {
            if (block.x === this.fruit.pos.x && block.y === this.fruit.pos.y) {
                this.fruit.randomize();
            }
        }
    }

    checkFail() {
        if (this.gameStarted) {
            if (
                this.snake.body[0].x < 0 || this.snake.body[0].x >= cellNumber ||
                this.snake.body[0].y < 2 || this.snake.body[0].y >= cellNumber
            ) {
                this.finalTime = this.elapsedTime;
                this.endStatus = true;
            }

            for (let block of this.snake.body.slice(1)) {
                if (block.x === this.snake.body[0].x && block.y === this.snake.body[0].y) {
                    this.finalTime = this.elapsedTime;
                    this.endStatus = true;
                }
            }
        }
    }

    drawGrass() {
        let grassColor = '#A7D13D';
        for (let row = 0; row < cellNumber; row++) {
            for (let col = 0; col < cellNumber; col++) {
                if ((row + col) % 2 === 0) {
                    ctx.fillStyle = grassColor;
                    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    drawScore() {
        this.score = this.snake.body.length - 3;
        ctx.fillStyle = '#384A0C';
        ctx.font = '25px Arial';
        ctx.fillText(`Score: ${this.score}`, width - 100, 30);
    }

    drawTimer() {
        this.elapsedTime = Math.floor(Date.now() / 1000) - this.startTime;
        ctx.fillStyle = '#384A0C';
        ctx.font = '25px Arial';
        ctx.fillText(`Time: ${this.elapsedTime}s`, 20, 30);
    }

    timeOver() {
        if (this.elapsedTime >= 60) {
            this.finalTime = this.elapsedTime;
            this.endStatus = true;
        }
    }

    drawPauseMessage() {
        let message = "Game Paused\n\nPress Space to Resume";
        ctx.fillStyle = 'purple';
        ctx.font = '25px Arial';
        this.drawMultilineText(ctx, message, width / 2 - 150, height / 2 - 50);
    }

    drawStartMessage() {
        let message = "Press Enter to Play\n\nYou have 60 seconds to score\n\nKey Bindings\n↑ or W: Move up\n↓ or S: Move down\n← or A: Move left\n→ or D: Move right\n\nSpace: Pause";
        ctx.fillStyle = 'purple';
        ctx.font = '25px Arial';
        this.drawMultilineText(ctx, message, width / 2 - 150, height / 2 - 150);
    }

    drawLostMessage() {
        if (this.finalTime < 60) {
            let message = `Time survived: ${this.finalTime}s\nYour score: ${this.score}\n\nPress Enter to Play Again`;
            ctx.fillStyle = 'red';
            ctx.font = '25px Arial';
            this.drawMultilineText(ctx, message, width / 2 - 150, height / 2 - 50);
        } else {
            let message = `Time is over!!\nYour score: ${this.score}\n\nPress Enter to Play Again`;
            ctx.fillStyle = 'purple';
            ctx.font = '25px Arial';
            this.drawMultilineText(ctx, message, width / 2 - 150, height / 2 - 50);
        }
    }

    drawMultilineText(ctx, text, x, y) {
        let lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + (i * 25));
        }
    }

    startGame() {
        this.gameStarted = true;
        this.startTime = Math.floor(Date.now() / 1000);
        this.snake.direction = { x: 1, y: 0 };
    }

    togglePause() {
        if (this.paused) {
            this.startTime = Math.floor(Date.now() / 1000) - this.elapsedTime;
        }
        this.paused = !this.paused;
    }
}

const game = new Game();

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'Enter':
            if (!game.gameStarted && !game.endStatus) {
                game.startGame();
            }
            if (game.endStatus) {
                game.endStatus = false;
                game.gameStarted = false;
                game.snake.reset();
            }
            break;
        case ' ':
            if (game.gameStarted) {
                game.togglePause();
            }
            break;
        case 'q':
            window.close();
            break;
        case 'ArrowUp':
        case 'w':
            if (game.snake.direction.y !== 1) {
                game.snake.direction = { x: 0, y: -1 };
            }
            break;
        case 'ArrowRight':
        case 'd':
            if (game.snake.direction.x !== -1) {
                game.snake.direction = { x: 1, y: 0 };
            }
            break;
        case 'ArrowDown':
        case 's':
            if (game.snake.direction.y !== -1) {
                game.snake.direction = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
        case 'a':
            if (game.snake.direction.x !== 1) {
                game.snake.direction = { x: -1, y: 0 };
            }
            break;
    }
});

function gameLoop(timestamp) {
    if (!game.lastTime) {
        game.lastTime = timestamp;
    }

    let delta = timestamp - game.lastTime;

    if (delta > interval) {
        ctx.clearRect(0, 0, width, height);
        game.update(delta);
        game.draw();
        game.lastTime = timestamp;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
