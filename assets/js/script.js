// DOM elements
var questionsEl = document.querySelector("#questions");
var timerEl = document.querySelector("#time");
var choicesEl = document.querySelector("#choices");
var submitBtn = document.querySelector("#submit");
var startBtn = document.querySelector("#start");
var initialsEl = document.querySelector("#initials");
var feedbackEl = document.querySelector("#feedback");

// Quiz state variables
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

function startQuiz() {
  // Hide start screen
  var startScreenEl = document.getElementById("start-screen");
  startScreenEl.setAttribute("class", "hide");

  // Un-hide questions section
  questionsEl.removeAttribute("class");

  // Start timer
  timerId = setInterval(clockTick, 1000);

  // Show starting time
  timerEl.textContent = time;

  getQuestion();
}

function getQuestion() {
  // Get current question object from array
  var currentQuestion = questions[currentQuestionIndex];

  // Update title with current question
  var titleEl = document.getElementById("question-title");
  titleEl.textContent = currentQuestion.title;

  // Clear out any old question choices
  choicesEl.innerHTML = "";

  // Loop over choices
  currentQuestion.choices.forEach(function(choice, i) {
    // Create new button for each choice
    var choiceNode = document.createElement("button");
    choiceNode.setAttribute("class", "choice");
    choiceNode.setAttribute("value", choice);

    choiceNode.textContent = i + 1 + ". " + choice;

    // Attach click event listener to each choice
    choiceNode.onclick = questionClick;

    // Display on the page
    choicesEl.appendChild(choiceNode);
  });
}

function questionClick() {
  // Check if user guessed wrong
  if (this.value !== questions[currentQuestionIndex].answer) {
    // Penalize time
    time -= 10;

    if (time < 0) {
      time = 0;
    }
    // Display new time on page
    timerEl.textContent = time;
    feedbackEl.textContent = "Wrong!";
    feedbackEl.style.color = "gray";
    feedbackEl.style.fontSize = "200%";
  } else {
    feedbackEl.textContent = "Correct!";
    feedbackEl.style.color = "gray";
    feedbackEl.style.fontSize = "200%";
  }

  // Show right/wrong feedback
  feedbackEl.setAttribute("class", "feedback");
  setTimeout(function() {
    feedbackEl.setAttribute("class", "feedback hide");
  }, 1000);

  // Next question
  currentQuestionIndex++;

  // Time Checker
  if (currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // Stop timer
  clearInterval(timerId);

  // Show End Screen
  var endScreenEl = document.getElementById("end-screen");
  endScreenEl.removeAttribute("class");

  // Show Final Score
  var finalScoreEl = document.getElementById("final-score");
  finalScoreEl.textContent = time;

  // Hide questions section
  questionsEl.setAttribute("class", "hide");
}

function clockTick() {
  // Update time
  time--;
  timerEl.textContent = time;

  // Check if user ran out of time
  if (time <= 0) {
    quizEnd();
  }
}

function saveHighscore() {
  // Get value of input box
  var initials = initialsEl.value.trim();

  if (initials !== "") {
    // Get saved scores from localstorage, or if not any, set to empty array
    var highscores =
      JSON.parse(window.localStorage.getItem("highscores")) || [];

    // Format new score object for current user
    var newScore = {
      score: time,
      initials: initials
    };

    // Save to localstorage
    highscores.push(newScore);
    window.localStorage.setItem("highscores", JSON.stringify(highscores));

    // Redirect to next page
    window.location.href = "score.html";
  }
}

function checkForEnter(event) {
  // "13" represents the enter key
  if (event.key === "Enter") {
    saveHighscore();
  }
}

// Submit initials
submitBtn.onclick = saveHighscore;

// Start Quiz
startBtn.onclick = startQuiz;

initialsEl.onkeyup = checkForEnter;