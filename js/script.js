document.getElementById("nextBtn").addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();

  if (!username) {
    alert("Please enter your name.");
    return;
  }

  // Store in sessionStorage
  sessionStorage.setItem("quizUser", JSON.stringify({ name: username }));

  // Redirect to quiz page
  window.location.href = "quiz.html";
});
