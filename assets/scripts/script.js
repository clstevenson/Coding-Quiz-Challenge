// Clicking the "View High Scores" element will go to the page

// select by ID
var launchPageEl = document.getElementById("launch-page");
var highScoresPageEl = document.getElementById("high-scores");
var questionsContainerEl = document.getElementById("all-questions");


// TODO add countdown timer


///////////////////////////////////////////////////////////////////////////////
//                              Event Listeners                              //
///////////////////////////////////////////////////////////////////////////////

// view the high scores from the launch screen
var viewHighScoresEl = document.getElementById("high-scores-link");
viewHighScoresEl.addEventListener("click", function() {
  // turn off the launch page display, turn on the high scores page
  launchPageEl.style.display = "none";
  highScoresPageEl.style.display = "block";
});

// return to the launch page from the high scores page
var btnGoBackEl = document.getElementById("go-back");
btnGoBackEl.addEventListener("click", function() {
  // turn off the high scores page and turn on the launch page
  launchPageEl.style.display = "block";
  highScoresPageEl.style.display = "none";
});

// button to start the quiz
var btnStartQuizEl = document.getElementById("btn-start");
btnStartQuizEl.addEventListener("click", function() {
  // turn off the launch page
  launchPageEl.style.display = "none";

  // turn on the section with the first question
  // for now this is a place-holder, eventually it will be chosen programmatically
  firstQuestionEl = document.getElementById("Q1")
  firstQuestionEl.style.display = "block";
});

// set event listener for the div containing all the questions
// when the user clicks on their choice of answer,
// get the target by event delegation and proceed accordingly
answerList.addEventListener("click", function(evt) {
  // retrieve the button that was selected
  var chosenAnswerEl = evt.target;

  /*
   * Take action:
   * - hide the current question
   * - if the next question exists, display it
   * - give feedback to the user on whether they got the previous Q wrong
   * - if the next question doesn't exist, display the "finished" section
   */

  /*
  if (chosenAnswerEl.className == 'correct') {
    console.log("The choice was correct");
    questionsEl[questionNumber].children[2].textContent = "Correct!"
    questionsEl[questionNumber].style.display = "block";
  } else {
    console.log("That was not correct");
    questionsEl[questionNumber].children[2].textContent = "Wrong!"
    questionsEl[questionNumber].style.display = "block";
  }
   */
});
