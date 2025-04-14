const user = JSON.parse(sessionStorage.getItem("quizUser"));
let currentIndex = 0;
let score = 0;
let mainTimer;
let countdownTimer;
let questions = [];

const questionEl = document.getElementById("questionContainer");
const answersEl = document.getElementById("answersContainer");
const timerEl = document.getElementById("timer");
const loadingNextEl = document.getElementById("loadingNext");
const restartButton = document.getElementById("restartQuiz");

function restartQuiz() {
  currentIndex = 0;
  score = 0;
  questions = shuffleArray(questions);
  restartButton.style.display = "none";
  showQuestion();
}

restartButton.addEventListener("click", restartQuiz);

if (!user || !user.name) {
  window.location.href = "index.html"; // redirect if no user
}

document.getElementById("welcome").textContent = `${user.name}`;

const currentPlayer = {
  name: sessionStorage.getItem("quizUser"),
  score: score,
};

// Save to session for display
sessionStorage.setItem("quizResult", JSON.stringify(currentPlayer));

// Track all players during session
const allPlayers = JSON.parse(sessionStorage.getItem("allPlayers")) || [];
allPlayers.push(currentPlayer);
sessionStorage.setItem("allPlayers", JSON.stringify(allPlayers));

//Shuffle questions
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//Fetching questions

async function fetchQuestions() {
  try {
    const response = await fetch("./data/dbCopy.json");
    const data = await response.json();
    questions = shuffleArray(data.quizQuestions).slice(0, 3); // Limit to 20 questions
    showQuestion();
    console.log(data.quizQuestions);
  } catch (error) {
    console.log("Error fetching questions:", error);
    questionEl.innerHTML = "<p>Failed loading questions. Please try again.</p>";
  }
}

function showQuestion() {
  loadingNextEl.textContent = "";
  clearTimeout(mainTimer);
  clearTimeout(countdownTimer);
  timerEl.textContent = "";

  const current = questions[currentIndex];

  const questionNumber = `<p>Pitanje ${currentIndex + 1} od ${
    questions.length
  }</p>`;

  questionEl.innerHTML = questionNumber + `<p>${current.question}</p>`;
  if (current.image) {
    questionEl.innerHTML += `<img class="image" src="${current.image}" alt="Question Image">`;
  }

  answersEl.innerHTML = "";
  current.answers.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.addEventListener("click", () => selectAnswer(i));
    answersEl.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  let timeLeft = 30;
  timerEl.textContent = `Preostalno vreme: ${timeLeft}s`;

  mainTimer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Preostalo vreme: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(mainTimer);
      timerEl.textContent = "Vreme je isteklo!";
      nextCountdown();
    }
  }, 1000);
}

function selectAnswer(selectedIndex) {
  clearInterval(mainTimer);
  const current = questions[currentIndex];

  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === current.correct) {
    score++;
    timerEl.textContent = "Tačno!";
  } else {
    timerEl.textContent = "Netačno!";
  }

  nextCountdown();
}

function nextCountdown() {
  let count = 3;
  loadingNextEl.textContent = `Slredeće pitanje ${count}...`;

  countdownTimer = setInterval(() => {
    count--;
    if (count > 0) {
      loadingNextEl.textContent = `Sledeće pitanje ${count}...`;
    } else {
      clearInterval(countdownTimer);
      currentIndex++;
      if (currentIndex < questions.length) {
        showQuestion();
      } else {
        finishQuiz();
      }
    }
  }, 1000);
}

function finishQuiz() {
  // sessionStorage.setItem(
  //   "quizResult",
  //   JSON.stringify({ name: user.name, score })
  // );
  // window.location.href = "highscore.html";
  // restartButton.style.display = "block";
  // // Display final score
  // questionEl.innerHTML = `<p>Rezultat: ${score}/${questions.length}</p>`;
  // answersEl.innerHTML = ""; // Clear answers
  // timerEl.textContent = ""; // Clear timer
  // loadingNextEl.textContent = ""; // Clear loading text
  // Retrieve the existing allPlayers array from sessionStorage
  const allPlayers = JSON.parse(sessionStorage.getItem("allPlayers")) || [];

  // Add the current player's result to the array
  allPlayers.push({ name: user.name, score });

  // Save the updated allPlayers array back to sessionStorage
  sessionStorage.setItem("allPlayers", JSON.stringify(allPlayers));

  // Save the current player's result separately for display on the highscore page
  sessionStorage.setItem(
    "quizResult",
    JSON.stringify({ name: user.name, score })
  );

  // Redirect to the highscore page
  window.location.href = "highscore.html";
}

fetchQuestions();
