const GRID_WIDTH = 11;
const GRID_HEIGHT = 17;
let grid = [];
let currentBlock = null;
let currentBlockPosition = { x: 0, y: 0 };
let lastUpdateTime = 0;
let timeSinceLastMove = 0;
const moveInterval = 150;
const fastMoveInterval = 50;
let currentMoveInterval = moveInterval;
const scoreDisplay = document.getElementById('score');
let score = 0;
const restartButton = document.getElementById('restart-button');
let gameOverMessage = null;

function toggleFastMove(enableFastMove) {
  currentMoveInterval = enableFastMove ? fastMoveInterval : moveInterval;
}

const blocks = [
  [
    [1, 1],
    [1, 1],
  ],
  [
    [1, 1, 1, 1],
  ],
  [
    [1, 1, 1],
    [0, 1, 0],
  ],
];

function createGrid() {
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      row.push(0);
    }
    grid.push(row);
  }
}

function createBlock() {
  const randomIndex = Math.floor(Math.random() * blocks.length);
  const block = blocks[randomIndex];
  currentBlock = block;
  currentBlockPosition.x = Math.floor((GRID_WIDTH - block[0].length) / 1.8);
  currentBlockPosition.y = 0;
}

function renderGrid() {
  const gridContainer = document.getElementById('grid-container');
  gridContainer.innerHTML = '';
  grid.forEach((row, y) => {
    const rowElement = document.createElement('div');
    rowElement.classList.add('grid-row');
    row.forEach((cell, x) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('grid-cell');
      if (cell === 1 || (y >= currentBlockPosition.y && y < currentBlockPosition.y + currentBlock.length && x >= currentBlockPosition.x && x < currentBlockPosition.x + currentBlock[0].length && currentBlock[y - currentBlockPosition.y][x - currentBlockPosition.x] === 1)) {
        cellElement.classList.add('block');
      }
      rowElement.appendChild(cellElement);
    });
    gridContainer.appendChild(rowElement);
  });
}

function moveDown() {
  if (!checkCollision(0, 1)) {
    currentBlockPosition.y++;
  } else {
    mergeBlock();
    createBlock();
  }
}

function moveLeft() {
  if (!checkCollision(-1, 0)) {
    currentBlockPosition.x--;
  }
}

function moveRight() {
  if (!checkCollision(1, 0)) {
    currentBlockPosition.x++;
  }
}

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('move-left-button').addEventListener('click', function() {
        moveLeft();
    });

    document.getElementById('move-right-button').addEventListener('click', function() {
        moveRight();
    });

    document.getElementById('rotate-button').addEventListener('click', function() {
        rotateBlock();
    });
});

function checkCollision(deltaX, deltaY) {
  for (let y = 0; y < currentBlock.length; y++) {
    for (let x = 0; x < currentBlock[0].length; x++) {
      if (currentBlock[y][x] === 1) {
        const newX = currentBlockPosition.x + x + deltaX;
        const newY = currentBlockPosition.y + y + deltaY;
        if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT || (newY >= 0 && grid[newY][newX])) {
          return true;
        }
      }
    }
  }
  return false;
}

function mergeBlock() {
  for (let y = 0; y < currentBlock.length; y++) {
    for (let x = 0; x < currentBlock[0].length; x++) {
      if (currentBlock[y][x] === 1) {
        const newX = currentBlockPosition.x + x;
        const newY = currentBlockPosition.y + y;
        grid[newY][newX] = 1;
      }
    }
  }
}

function update(currentTime) {
  const deltaTime = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;
  timeSinceLastMove += deltaTime;

  if (timeSinceLastMove > moveInterval) {
    moveDown();
    timeSinceLastMove = 0;
  }

  renderGrid();
  requestAnimationFrame(update);
}

function startGame() {
  createGrid();
  createBlock();
  update(0);
}

function rotateBlock() {
  const rotatedBlock = [];
  for (let x = 0; x < currentBlock[0].length; x++) {
    const newRow = [];
    for (let y = currentBlock.length - 1; y >= 0; y--) {
      newRow.push(currentBlock[y][x]);
    }
    rotatedBlock.push(newRow);
  }

  if (!checkCollision(0, 0, rotatedBlock)) {
    currentBlock = rotatedBlock;
  }
}

document.addEventListener('keyup', function(event) {
  if (event.key === 's') {
    toggleFastMove(false);
  }
});

function update(currentTime) {
  const deltaTime = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;
  timeSinceLastMove += deltaTime;

  if (timeSinceLastMove > currentMoveInterval) {
    moveDown();
    timeSinceLastMove = 0;
  }

  renderGrid();
  requestAnimationFrame(update);
}

function checkAndClearLines() {
  for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
    let isLineComplete = true;
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x] === 0) {
        isLineComplete = false;
        break;
      }
    }
    if (isLineComplete) {
      for (let yy = y; yy > 0; yy--) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          grid[yy][x] = grid[yy - 1][x];
        }
      }
      for (let x = 0; x < GRID_WIDTH; x++) {
        grid[0][x] = 0;
      }
      y++;
    }
  }
}

function moveDown() {
  if (!checkCollision(0, 1)) {
    currentBlockPosition.y++;
  } else {
    mergeBlock();
    checkAndClearLines();
    createBlock();
  }
}

function updateScore(newScore) {
  score = newScore;
  scoreDisplay.textContent = `Pontuação: ${score}`;
}

function checkAndClearLines() {
  let linesCleared = 0;
  for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
    let isLineComplete = true;
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (grid[y][x] === 0) {
        isLineComplete = false;
        break;
      }
    }
    if (isLineComplete) {
      for (let yy = y; yy > 0; yy--) {
        for (let x = 0; x < GRID_WIDTH; x++) {
          grid[yy][x] = grid[yy - 1][x];
        }
      }
      for (let x = 0; x < GRID_WIDTH; x++) {
        grid[0][x] = 0;
      }
      y++;
      linesCleared++;
    }
  }
  if (linesCleared > 0) {
    updateScore(score + linesCleared);
  }
}

function moveDown() {
  if (!checkCollision(0, 1)) {
    currentBlockPosition.y++;
  } else {
    mergeBlock();
    checkAndClearLines();
    createBlock();
  }
}

function checkGameOver() {
  for (let x = 0; x < GRID_WIDTH; x++) {
    if (grid[0][x] === 1) {
      return true;
    }
  }
  return false;
}

function restartGame() {
  grid = [];
  createGrid();
  updateScore(0);
  createBlock();
  if (gameOverMessage) {
    gameOverMessage.parentNode.removeChild(gameOverMessage);
    gameOverMessage = null;
  }
  update(0);
}

restartButton.addEventListener('click', restartGame);

function update(currentTime) {
  const deltaTime = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;
  timeSinceLastMove += deltaTime;

  if (timeSinceLastMove > currentMoveInterval) {
    moveDown();
    timeSinceLastMove = 0;
  }

  renderGrid();
  if (checkGameOver()) {
    renderGameOver();
    return;
  }
  requestAnimationFrame(update);
}

function renderGameOver() {
  gameOverMessage = document.createElement('p');
  gameOverMessage.classList.add('gameover')
  gameOverMessage.textContent = 'Game Over!';
  document.body.appendChild(gameOverMessage);
  restartButton.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', startGame);

document.addEventListener('keydown', function(event) {
  if (event.key === 'd') {
    moveRight();
  } else if (event.key === 'a') {
    moveLeft();
  }
  else if (event.key === 'r') {
    rotateBlock();
  }
});

function reloadPage() {
  location.reload();
}