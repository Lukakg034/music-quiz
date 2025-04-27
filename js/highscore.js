"use strict";
const result = JSON.parse(sessionStorage.getItem("quizResult"));
const allPlayers = JSON.parse(sessionStorage.getItem("allPlayers")) || [];
// console.log(allPlayers);
// if (!result || !result.name || result.score === undefined) {
//   window.location.href = "index.html";
// } else {
//   document.getElementById("username").textContent = `Player: ${result.name}`;
//   document.getElementById(
//     "score"
//   ).textContent = `Your Score: ${result.score} correct answers`;
// }

const playerList = document.getElementById("playerList");

// Iterate through all players
allPlayers.forEach((player) => {
  const li = document.createElement("li");

  const playerName =
    typeof player.name === "string" ? player.name : player.name.name;

  li.textContent = `${player.name}: Tačni odgovori: ${player.score} `;
  playerList.appendChild(li);
});

function playAgain() {
  // Only clear result and quizUser, keep allPlayers list for session
  sessionStorage.removeItem("quizResult");
  sessionStorage.removeItem("quizUser");
  window.location.href = "index.html";
}
// if (!result || !result.name || result.score === undefined) {
//   window.location.href = "index.html"; // fallback
// } else {
//   document.getElementById("username").textContent = `Player: ${result.name}`;
//   document.getElementById("score").textContent = `Your Score: ${result.score}`;
// }

function playAgain() {
  // sessionStorage.clear(); // clear everything stored during quiz
  sessionStorage.removeItem("quizResult");
  sessionStorage.removeItem("quizUser");
  window.location.href = "index.html";
}
