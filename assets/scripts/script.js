// elements selected by ID
var launchPageEl = document.getElementById("launch-page");
var highScoresPageEl = document.getElementById("high-scores");
var finishedPageEl = document.getElementById("finished");
var questionsContainerEl = document.getElementById("all-questions");

// First retrieve an array of all sections containing questions
var sectionQuestionEl = document.querySelectorAll(".question");

///////////////////////////////////////////////////////////////////////////////
//      If I add a routine to scramble the questions, insert it here         //
///////////////////////////////////////////////////////////////////////////////

// Identify the first question since it is special
var firstQuestionEl = sectionQuestionEl[0];

// For each question section, find all the buttons and give them a data-attribute
// that identifies them as belonging to the same question
// Let's use zero-based indexing for the question numbers, seems simpler and safer

// For loops to label each button with its question number
// Maybe there is a better/easier way?
for (var qnum = 0; qnum < sectionQuestionEl.length; qnum++) {
  // loop thru children elements of current question
  for (var i = 0; i < sectionQuestionEl[qnum].children.length; i++) {
    var questionEl = sectionQuestionEl[qnum].children[i];
    // if element is OL, then set the data attribute qnum
    if (questionEl.tagName === "OL") {
      for (var j = 0; j < questionEl.children.length; j++) {
        // each li should be the only children of the ol
        // And each li should only have one child, a button
        questionEl.children[j].firstChild.dataset.qnum = qnum;
      };
    };
  };
};


// Add countdown timer
// set up variables/function for timer
var timeLeft = 75;
var timerEl = document.getElementById("timer");
function displayTimeLeft() {
  timeLeft--;
  timerEl.textContent = timeLeft;
};
// display 75 sec initially (in landing page) before timer starts
timerEl.textContent = timeLeft;


// TODO store and clear high scores (local storage I assume)



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
  firstQuestionEl.style.display = "block";
  // start the timer
  timeLeft = 75;   // initialize
  setInterval(displayTimeLeft, 1000);
});

// set event listener for the div containing all the questions
// when the user clicks on their choice of answer,
// get the target by event delegation and proceed accordingly
questionsContainerEl.addEventListener("click", function(evt) {
  // retrieve the button that was selected
  var chosenAnswerEl = evt.target;

  // create variables from data stored with clicked item
  var qnum = +chosenAnswerEl.dataset.qnum;
  var isCorrect = (chosenAnswerEl.dataset.correct === "true");

  // after the last question we need to do something different
  var lastQ = sectionQuestionEl.length - 1;

  /*
   * Take action:
   * - hide the current question
   * - if the next question exists, display it
   * - give feedback to the user on whether they got the previous Q wrong
   * - if the next question doesn't exist, display the "finished" section
   */

  if (isCorrect && qnum < lastQ) {
    // feedback to user
    sectionQuestionEl[qnum+1].children[2].textContent = "Correct!"
    // turn off current question, move to next question
    sectionQuestionEl[qnum].style.display = "none";
    sectionQuestionEl[qnum+1].style.display = "block";
  } else if (qnum < lastQ) {
    // feedback to user
    sectionQuestionEl[qnum+1].children[2].textContent = "Wrong!"
    // turn off current question, move to next question
    sectionQuestionEl[qnum].style.display = "none";
    sectionQuestionEl[qnum+1].style.display = "block";
  } else {
    // we are at the last question, need to display score and get initials
    sectionQuestionEl[qnum].style.display = "none";
    finishedPageEl.style.display = "block";
    console.log("Correct answer on last Q? " + isCorrect);
  }
});
