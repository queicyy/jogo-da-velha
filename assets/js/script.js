const cells = document.querySelectorAll(".cell");
const gameBoard = document.getElementById("game-board");
const gameStatus = document.getElementById("game-status");
const gameTitle = document.getElementById("game-title");
const gameForm = document.getElementById("game-form");
const startButton = document.getElementById("start-game");
const restartButton = document.getElementById("restart-game");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const playerInfo = document.getElementById("player-info");
const rankingList = document.getElementById("ranking-list");

let currentPlayer = "O";
let board = Array(9).fill("");
let player1 = "";
let player2 = "";
let ranking = JSON.parse(localStorage.getItem("ranking")) || [];


displayRanking()
fadeIn()

function initGame() {
  fadeIn()

  cells.forEach((cell) => {
    cell.style.backgroundColor = "transparent"
  });

  playerInfo.classList.add("hidden")

  player1 = player1Input.value || "Jogador 1";
  player2 = player2Input.value || "Jogador 2";
  currentPlayer = "O";
  board.fill("");
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.addEventListener("click", handleCellClick, { once: true });
  });
  gameStatus.textContent = `${player1} (O) começa!`;
  gameStatus.classList.remove("hidden");
  gameBoard.classList.remove("hidden");
  startButton.classList.remove("hidden");
  saveGameState();
  updateRanking();
}

function handleCellClick(event) {
  const cell = event.target;
  const index = cell.getAttribute("data-index");

  if (!board[index]) {
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.style.backgroundColor = currentPlayer === "O" ? "green" : "red";

    saveGameState();

    if (checkWinner()) {
      endGame(`${currentPlayer === "O" ? player1 : player2} venceu!`);
    } else if (board.every((cell) => cell !== "")) {
      endGame("Empate!");
    } else {
      switchPlayer();
    }
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === "O" ? "X" : "O";
  gameStatus.textContent = `${
    currentPlayer === "O" ? player1 : player2
  } (${currentPlayer}) é a sua vez!`;
  saveGameState();
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some((combination) => {
    return combination.every((index) => board[index] === currentPlayer);
  });
}

function endGame(message) {
  gameStatus.textContent = message;
  cells.forEach((cell) => {
    cell.removeEventListener("click", handleCellClick)
  });
  updateRankingAfterGame();
  restartButton.classList.remove("hidden");

  restartButton.addEventListener("click", initGame)

  localStorage.removeItem("board");
  localStorage.removeItem("currentPlayer");
  localStorage.removeItem("player1");
  localStorage.removeItem("player2");
}

function updateRankingAfterGame() {
  const winner = currentPlayer === "0" ? player1 : player2;

  if (gameStatus.textContent.includes("Empate")) {
    return;
  } else {
    updatePlayerScore(winner);
  }

  localStorage.setItem("ranking", JSON.stringify(ranking));
  displayRanking();
}

function updatePlayerScore(player) {
  let playerEntry = ranking.find((entry) => entry.name === player);
  if (!playerEntry) {
    playerEntry = {
      name: player,
      wins: 0,
    };
    ranking.push(playerEntry);
  }
  playerEntry.wins++;
}

function displayRanking() {
  rankingList.innerHTML = "";

  ranking.sort((entry1, entry2) => entry2.wins - entry1.wins ).forEach((entry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.name}: ${entry.wins} vitória(s)`;
    rankingList.appendChild(listItem);
  });
}

function updateRanking() {}

function saveGameState() {
  localStorage.setItem("board", JSON.stringify(board));
  localStorage.setItem("currentPlayer", currentPlayer);
  localStorage.setItem("player1", player1);
  localStorage.setItem("player2", player2);
}

function fadeIn(){
  gameTitle.classList.remove("fadeIn")
  playerInfo.classList.remove("fadeIn")
  gameStatus.classList.remove("fadeIn")

  setTimeout(() => {
    gameTitle.classList.add("fadeIn")
    playerInfo.classList.add("fadeIn")
    gameStatus.classList.add("fadeIn")
  }, 1)
}

gameForm.addEventListener("submit", e => {
  e.preventDefault()
  initGame()
})
