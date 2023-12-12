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


// Make "Start Quiz" button clickable to go to Q1
var btnStartQuizEl = document.getElementById("btn-start");

// retrieve an array of question lists
// then loop thru each question and get the responses
var firstQuestionEl = document.getElementById("Q1");

btnStartQuizEl.addEventListener("click", function() {
  // turn off the launch page and turn on the Q1 page
  launchPageEl.style.display = "none";
  firstQuestionEl.style.display = "block";
});


/*
 * TODO For each question, respond to user selection
 * If the user selects the correct answer, move to next window and append "Correct!"
 * If the user selects the wrong answer, subtract 10 sec frmo the timer, move to the next window and append "Wrong!"
 */

// return list of possible answers (which are child elements of the ol)
var answerList = document.querySelector(".question ol");

answerList.addEventListener("click", function(evt) {
  var chosenAnswerEl = evt.target;
  if (chosenAnswerEl.className == 'correct') {
    console.log("The choice was correct");
  } else {
    console.log("That was not correct");
  }
});
