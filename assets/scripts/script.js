// Clicking the "View High Scores" element will go to the page

// select by ID
var viewHighScoresEl = document.getElementById("high-scores-link");
var launchPageEl = document.getElementById("launch-page");
var highScoresPageEl = document.getElementById("high-scores");

// add event listener
viewHighScoresEl.addEventListener("click", function() {
  // turn off the launch page display
  launchPageEl.style.display = "none";
  // turn on the high scores page
  highScoresPageEl.style.display = "block";
});

// now need a way to return to the launch page from the high scores page
var btnGoBackEl = document.getElementById("go-back");

btnGoBackEl.addEventListener("click", function() {
  // turn off the high scores page and turn on the launch page
  launchPageEl.style.display = "block";
  highScoresPageEl.style.display = "none";
});


// TODO add countdown timer


// TODO Make "Start Quiz" button clickable to go to Q1


// TODO For each question, respond to user selection

/*
 * TODO For each question, respond to user selection
 * If the user selects the correct answer, move to next window and append "Correct!"
 * If the user selects the wrong answer, subtract 10 sec frmo the timer, move to the next window and append "Wrong!"
 */