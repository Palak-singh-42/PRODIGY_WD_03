const board = document.getElementById("board");
const statusText = document.getElementById("status");
const modeRadios = document.getElementsByName("mode");

let currentPlayer = "X";
let gameActive = true;
let gameState = Array(9).fill("");
let isVsAI = false;

const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8], // Rows
  [0,3,6], [1,4,7], [2,5,8], // Columns
  [0,4,8], [2,4,6]           // Diagonals
];

function initBoard() {
  board.innerHTML = "";
  gameState = Array(9).fill("");
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = "Player X's turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleMove);
    board.appendChild(cell);
  }

  updateMode();
}

function handleMove(e) {
  const index = e.target.dataset.index;

  if (!gameActive || gameState[index] !== "") return;

  gameState[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner()) {
    statusText.textContent = `🎉 Player ${currentPlayer} wins!`;
    gameActive = false;
    highlightWinner();
    return;
  } else if (!gameState.includes("")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (isVsAI && currentPlayer === "O") {
    setTimeout(aiMove, 400);
  }
}

function checkWinner() {
  return winningCombos.some(combo => {
    const [a, b, c] = combo;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[b] === gameState[c]
    ) {
      document.querySelectorAll(".cell")[a].classList.add("win");
      document.querySelectorAll(".cell")[b].classList.add("win");
      document.querySelectorAll(".cell")[c].classList.add("win");
      return true;
    }
    return false;
  });
}

function aiMove() {
  if (!gameActive) return;

  let available = gameState
    .map((val, idx) => val === "" ? idx : null)
    .filter(idx => idx !== null);

  if (available.length === 0) return;

  const randomIndex = available[Math.floor(Math.random() * available.length)];
  const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
  handleMove({ target: cell });
}

function highlightWinner() {
  winningCombos.forEach(combo => {
    const [a, b, c] = combo;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[b] === gameState[c]
    ) {
      document.querySelectorAll(".cell")[a].classList.add("win");
      document.querySelectorAll(".cell")[b].classList.add("win");
      document.querySelectorAll(".cell")[c].classList.add("win");
    }
  });
}

function resetGame() {
  initBoard();
}

function updateMode() {
  isVsAI = document.querySelector("input[name='mode']:checked").value === "ai";
}

modeRadios.forEach(radio => {
  radio.addEventListener("change", updateMode);
});

initBoard();
