const result = JSON.parse(sessionStorage.getItem("quizResult"));
const allPlayers = JSON.parse(sessionStorage.getItem("allPlayers")) || [];

if (!result || !result.name || result.score === undefined) {
  window.location.href = "index.html";
} else {
  document.getElementById("username").textContent = `Player: ${result.name}`;
  document.getElementById(
    "score"
  ).textContent = `Your Score: ${result.score} correct answers`;
}
console.log(allPlayers);
console.log(result);
console.log(result.name);
console.log(result.score);
const playerList = document.getElementById("playerList");

allPlayers.forEach((player) => {
  const li = document.createElement("li");
  // const playerName = typeof player.name === "string" ? player.name : player.name.name;
  li.textContent = `${player.name}: ${player.score} tačna odgovora`;
  playerList.appendChild(li);
});
console.log(allPlayers);
console.log(result);
console.log(result.name);
console.log(result[1]);
console.log(result.score);
function playAgain() {
  // Only clear result and quizUser, keep allPlayers list for session
  sessionStorage.removeItem("quizResult");
  sessionStorage.removeItem("quizUser");
  window.location.href = "index.html";
}
if (!result || !result.name || result.score === undefined) {
  window.location.href = "index.html"; // fallback
} else {
  document.getElementById("username").textContent = `Player: ${result.name}`;
  document.getElementById("score").textContent = `Your Score: ${result.score}`;
}

function playAgain() {
  // sessionStorage.clear(); // clear everything stored during quiz
  sessionStorage.removeItem("quizResult");
  sessionStorage.removeItem("quizUser");
  window.location.href = "index.html";
}
