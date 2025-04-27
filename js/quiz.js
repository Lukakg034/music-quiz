const user = JSON.parse(sessionStorage.getItem("quizUser"));
// Saving user name to sessionStorage
// sessionStorage.setItem("quizUser", JSON.stringify(userName));

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

//Welcome message
document.getElementById("welcome").textContent = `${user.name}`;

//Fetching questions
async function fetchQuestions() {
  try {
    const response = await fetch("./data/dbCopy copy.json");
    const data = await response.json();
    questions = shuffleArray(data.quizQuestions).slice(0, 20); // Limit to 20 questions
    showQuestion();
    console.log(data.quizQuestions);
  } catch (error) {
    console.log("Error fetching questions:", error);
    questionEl.innerHTML = "<p>Failed loading questions. Please try again.</p>";
  }
}
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

function showQuestion() {
  loadingNextEl.textContent = "";
  clearTimeout(mainTimer);
  clearTimeout(countdownTimer);
  timerEl.textContent = "";

  const current = questions[currentIndex];

  const questionNumber = `<p class="question-number" >Pitanje ${
    currentIndex + 1
  } od ${questions.length}</p>`;

  //Check if the question has audio
  // if (current.hasAudio && current.audio) {
  //   questionEl.innerHTML += `<audio controls autoplay="true"><source src="${current.audio}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
  // } else {
  //   questionEl.innerHTML += `<p>${current.question}</p>`;
  //   if (current.image) {
  //     questionEl.innerHTML += `<img class="image" src="${current.image}" alt="Question Image">`;
  //   }
  // }

  questionEl.innerHTML =
    questionNumber + `<p class="current-question">${current.question}</p>`;
  if (current.image) {
    questionEl.innerHTML += `<img class="image" src="${current.image}" alt="Question Image">`;
  }
  // Check if the question has audio
  if (current.hasAudio && current.audio) {
    questionEl.innerHTML += `<audio id="question-audio" autoplay="true"><source src="${current.audio}" type="audio/mpeg">Your browser does not support the audio element.</audio>`;
  }
  // if (current.image) {
  //   questionEl.innerHTML += `<img class="image" src="${current.image}" alt="Question Image">`;
  // }

  // Audio element for volume control
  const audioElement = document.getElementById("question-audio");
  if (audioElement) {
    audioElement.volume = 0.2;
  }

  //Display answers
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

// function selectAnswer(selectedIndex) {
//   clearInterval(mainTimer);
//   const current = questions[currentIndex];

//   const buttons = answersEl.querySelectorAll("button");
//   buttons.forEach((btn) => (btn.disabled = true));

//   if (selectedIndex === current.correct) {
//     score++;
//     timerEl.textContent = "Tačno!";
//   } else {
//     timerEl.textContent = "Netačno!";
//   }

//   nextCountdown();
// }
function selectAnswer(selectedIndex) {
  clearInterval(mainTimer);
  const current = questions[currentIndex];

  const audioElement = document.getElementById("question-audio");
  if (audioElement) {
    audioElement.pause(); // Pause the audio
    audioElement.currentTime = 0; // Reset the audio to the beginning
  }
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((btn, index) => {
    // Disable all buttons
    btn.disabled = true;

    // Change button colors based on correctness
    if (index === selectedIndex) {
      if (index === current.correct) {
        btn.style.backgroundColor = "green"; // Correct answer
        btn.style.color = "white"; // Ensure text is readable
        score++;
      } else if (index === selectedIndex) {
        btn.style.backgroundColor = "red"; // Wrong answer
        btn.style.color = "white"; // Ensure text is readable
      } else {
        btn.style.backgroundColor = "gray"; // Grayed out for unselected buttons
        btn.style.color = "white"; // Ensure text is readable
      }
    }
  });
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

  const playerName =
    typeof user.name === "object" && user.name !== null
      ? user.name.name
      : user.name;
  const allPlayers = JSON.parse(sessionStorage.getItem("allPlayers")) || [];

  // Add the current player's result to the array
  allPlayers.push({ name: user.name, score });

  // Save the updated allPlayers array back to sessionStorage
  sessionStorage.setItem("allPlayers", JSON.stringify(allPlayers));

  // Save the current player's result separately for display on the highscore page
  sessionStorage.setItem(
    "quizResult",
    JSON.stringify({ name: playerName, score })
  );

  // Redirect to the highscore page
  window.location.href = "highscore.html";
}

fetchQuestions();
