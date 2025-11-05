const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const vsAIButton = document.getElementById('vsAI');
const vsPlayerButton = document.getElementById('vsPlayer');

let board = ['', '', '', '', '', '', '', '', ''];
const HUMAN = 'X';
const AI = 'O';
let currentPlayer = HUMAN;
let mode = null; // "AI" or "PVP"
let gameOver = false;

function createBoard() {
  boardElement.innerHTML = '';
  board.forEach((_, i) => {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.textContent = board[i];
    cell.addEventListener('click', () => handleMove(i));
    boardElement.appendChild(cell);
  });
}

function startGame(selectedMode) {
  mode = selectedMode;
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = HUMAN;
  gameOver = false;
  statusElement.textContent = mode === 'AI' ? "Your turn (X)" : "Player X’s turn";
  createBoard();
}

function handleMove(index) {
  if (board[index] || gameOver) return;

  board[index] = currentPlayer;
  updateBoard();

  if (checkWinner(board, currentPlayer)) {
    statusElement.textContent = (mode === 'PVP')
      ? `Player ${currentPlayer} wins! 🎉`
      : (currentPlayer === HUMAN ? "You win! 🎉" : "AI wins! 🤖");
    gameOver = true;
    return;
  }

  if (isDraw(board)) {
    statusElement.textContent = "It's a draw!";
    gameOver = true;
    return;
  }

  if (mode === 'AI') {
    if (currentPlayer === HUMAN) {
      currentPlayer = AI;
      statusElement.textContent = "AI thinking...";
      setTimeout(aiMove, 400);
    }
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function aiMove() {
  const bestMove = minimax(board, AI).index;
  board[bestMove] = AI;
  updateBoard();

  if (checkWinner(board, AI)) {
    statusElement.textContent = "AI wins! 🤖";
    gameOver = true;
  } else if (isDraw(board)) {
    statusElement.textContent = "It's a draw!";
    gameOver = true;
  } else {
    currentPlayer = HUMAN;
    statusElement.textContent = "Your turn (X)";
  }
}

function updateBoard() {
  document.querySelectorAll('.cell').forEach((cell, i) => {
    cell.textContent = board[i];
  });
}

function checkWinner(b, player) {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winCombos.some(combo => combo.every(i => b[i] === player));
}

function isDraw(b) {
  return b.every(cell => cell !== '');
}

// 🔮 Minimax Algorithm for AI
function minimax(newBoard, player) {
  const availSpots = newBoard
    .map((v, i) => v === '' ? i : null)
    .filter(v => v !== null);

  if (checkWinner(newBoard, HUMAN)) return { score: -10 };
  if (checkWinner(newBoard, AI)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i of availSpots) {
    const move = { index: i };
    newBoard[i] = player;

    move.score = (player === AI)
      ? minimax(newBoard, HUMAN).score
      : minimax(newBoard, AI).score;

    newBoard[i] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === AI) {
    let bestScore = -Infinity;
    moves.forEach((m, i) => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((m, i) => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

restartBtn.addEventListener('click', () => {
  if (!mode) {
    statusElement.textContent = "Choose a mode first!";
    return;
  }
  startGame(mode);
});

vsAIButton.addEventListener('click', () => startGame("AI"));
vsPlayerButton.addEventListener('click', () => startGame("PVP"));
