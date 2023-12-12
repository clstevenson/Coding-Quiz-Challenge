// elements selected by ID
var launchPageEl = document.getElementById("launch-page");
var highScoresPageEl = document.getElementById("high-scores");
var finishedPageEl = document.getElementById("finished");
var questionsContainerEl = document.getElementById("all-questions");

// First retrieve an array of all sections containing questions
var questionsPage = document.querySelectorAll(".question");

///////////////////////////////////////////////////////////////////////////////
//      If I add a routine to scramble the questions, insert it here         //
///////////////////////////////////////////////////////////////////////////////

// Identify the first question since it is special
var firstQuestionEl = questionsPage[0];

// For each question section, find all the buttons and give them a data-attribute
// that identifies them as belonging to the same question
// Let's use zero-based indexing for the question numbers, seems simpler and safer

// For loops to label each button with its question number
// Maybe there is a better/easier way?
for (var qnum = 0; qnum < questionsPage.length; qnum++) {
  // loop thru children elements of current question
  for (var i = 0; i < questionsPage[qnum].children.length; i++) {
    var questionEl = questionsPage[qnum].children[i];
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
var timeInterval;    // interval ID; needs to be global in scope

function displayTimeLeft() {
  timeLeft--;
  if (timeLeft <= 0) {
    timeLeft = 0;
    timerEl.textContent = timeLeft;
    clearInterval(timeInterval);
    displayFinal();
  }
  timerEl.textContent = timeLeft;
}
// display 75 sec initially (in landing page) before timer starts
timerEl.textContent = timeLeft;


// Function to display the final page along with the score
// it is assumed the timer interval would be cleared before calling the function
function displayFinal() {
  // if the timer is below zero, set to zero
  if (timeLeft < 0) {timeLeft = 0;}

  // set the final score to display
  var scoreEl = document.getElementById("final-score");
  scoreEl.textContent = "Final score: " + timeLeft;

  // makd sure all questions pages are hidden
  hideQuestions();

  // show the page
  finishedPageEl.style.display = "block";
}

function hideQuestions () {
  for (var i=0; i < questionsPage.length; i++) {
    questionsPage[i].style.display = "none";
  }
}

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
  // just in case, turn off all questions pages too
  hideQuestions();
  // and the finishing page too, in case it is showing
  finishedPageEl.style.display = "none";
});

// return to the launch page from the high scores page
var btnGoBackEl = document.getElementById("go-back");
btnGoBackEl.addEventListener("click", function() {
  // turn off the high scores page and turn on the launch page
  launchPageEl.style.display = "block";
  highScoresPageEl.style.display = "none";
  // just in case, turn off the questions pages
  hideQuestions();
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
  timeInterval = setInterval(displayTimeLeft, 1000);
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
  var lastQ = questionsPage.length - 1;

  // first check if on the last page
  if (qnum == lastQ) {
    console.log("I am here: last question! And it was " + isCorrect);
    // turn off the timer
    clearInterval(timeInterval);
    // assess penalty if last question incorrect
    if (!isCorrect) {timeLeft-=10;}
    // show final page
    displayFinal();
  } else if (isCorrect) {
    // not on the last page and the answer is correct
    questionsPage[qnum+1].children[2].textContent = "Correct!"
    // turn off current question, move to next question
    questionsPage[qnum].style.display = "none";
    questionsPage[qnum+1].style.display = "block";
  } else {
    // not on the last page and the answer was incorrect
    questionsPage[qnum+1].children[2].textContent = "Wrong!"
    // turn off current question, move to next question
    questionsPage[qnum].style.display = "none";
    questionsPage[qnum+1].style.display = "block";
    // assess penalty
    timeLeft-=10;
    if (timeLeft < 0) {
      // don't allow negative scores
      timeLeft = 0;
      // stop timer and display "finished" page
      clearInterval(timeInterval);
      displayFinal();
    }
  }
});
