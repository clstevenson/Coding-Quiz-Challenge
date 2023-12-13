// elements selected by ID
var launchPageEl = document.getElementById("launch-page");
var highScoresPageEl = document.getElementById("high-scores");
var finishedPageEl = document.getElementById("finished");
var questionsContainerEl = document.getElementById("all-questions");

///////////////////////////////////////////////////////////////////////////////
//                                High Scores                                 //
///////////////////////////////////////////////////////////////////////////////

/**********************
 * Array and local storage for the three objects (initials and score) that
 * have the highest score. Also need associated functions to update, save,
 * and order the scores.
 **********************/

// define variables we will need
var scoreListEl = document.querySelectorAll("#score-list li");
var initialsEl = document.getElementById("initials");
var scores = [];

function loadScores() {
  // load the scores from local storage into memory
  storedScores = JSON.parse(localStorage.getItem("scores"));
  if (storedScores != null) {
    scores = storedScores;
  }

  // use values below for testing, if needed
  // scores = [
  //   {
  //     initials: "IMS",
  //     score: 9
  //   },
  //   {
  //     initials: "HNS",
  //     score: 64
  //   },
  //   {
  //     initials: "CLS",
  //     score: 59
  //   },
  // ];

  sortScores();
}

// Load scores from memory
loadScores();

function saveScores() {
  // save scores from memory to local storage
  localStorage.setItem("scores", JSON.stringify(scores));
}

// updates high scores array, storage, and page (which may be hidden)
// Function called after quiz is completed
function updateScores(initials, score) {
  // sort scores first, just in case
  sortScores();

  // not sure how many scores we have
  var n = scores.length;

  // if we don't have 3 scores, add to the list
  if (n < 3) {
    scores.push({initials: initials, score: score});
  } else if (score > scores[2].score) {
    // displaces an existing score
    scores[2].initials = initials;
    scores[2].score = score;
    sortScores();
  }

  // Update local storage values
  saveScores();
}

// sorts score objects from highest to lowest (on the score value)
function sortScores(){
   if (scores.length > 1) {
    scores.sort(function(a,b) {return b.score - a.score;});
  }
}

// update the high score page with the scores array values
function writeScoresPage() {
  // sort the scores before displaying
  sortScores();

  // write to the scores page
  for (var i=0; i < scores.length; i++) {
    scoreListEl[i].textContent = scores[i].score + " (" + scores[i].initials + ")";
  }
}

// function below is called when the user clicks on the "Clear high scores" button
function clearScores() {
  // clear scores from memory
  scores = [];

  // clear scores from local storage
  localStorage.removeItem("scores");

  // clear high scores page (which might not be displayed)
  for (var i=0; i < scoreListEl.length; i++) {
    scoreListEl[i].textContent = "";
  }
}
// First retrieve an array of all sections containing questions
var questionsPage = document.querySelectorAll(".question");

///////////////////////////////////////////////////////////////////////////////
//      If I add a routine to scramble the questions, insert it here         //
///////////////////////////////////////////////////////////////////////////////

/*********************
 * TODO add routine to scramble the question order
 * TODO add routine to scamble the answers within a question
 * TODO add more questions (20 or more) and sample five of them for the quiz
 * TODO add more flexibility to the quiz: user can choose number of questions
 * - start time will be det'd automatically
 * - high scores will be based on avg time per question, or something similar
 * - default to 5 questions (and 75 sec)
 *********************/

/*********************
 * TODO refactor the code: number the sections instead of the buttons
 * I think some refactoring may be in order...instead of attaching the question
 * numbers to the button elements, attach them to their section great grandparent.
 * (the current sequence is section -> ol -> li -> button)
 *
 * Write a function to obtain the question number from the event (click) target,
 * which is the button.
 *
 * The advantage of this approach is that randomization and subsampling is easier:
 * - get an array of all section elements
 * - jumble the integers from 0 to length-1, and then assign them to the sections
 * - use the first N questions (five? user choice? See above block)
 *********************/

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
  if (timeLeft < 0) {
    timeLeft = 0;
  }

  // set the final score to display
  var scoreEl = document.getElementById("final-score");
  scoreEl.textContent = "Your final score is: " + timeLeft;

  // makd sure all questions pages are hidden
  hideQuestions();

  // show the page
  finishedPageEl.style.display = "block";
}

function hideQuestions() {
  for (var i = 0; i < questionsPage.length; i++) {
    questionsPage[i].style.display = "none";
  }
}


///////////////////////////////////////////////////////////////////////////////
//                              Event Listeners                              //
///////////////////////////////////////////////////////////////////////////////

// view the high scores from the launch screen
var viewHighScoresEl = document.getElementById("high-scores-link");
viewHighScoresEl.addEventListener("click", function() {
  // need to update the high scores page before showing it
  writeScoresPage();
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
    // turn off the timer
    clearInterval(timeInterval);
    // assess penalty if last question incorrect
    if (!isCorrect) { timeLeft -= 10; }
    // show final page
    displayFinal();
  } else if (isCorrect) {
    // not on the last page and the answer is correct
    questionsPage[qnum + 1].children[2].textContent = "Correct!"
    // turn off current question, move to next question
    questionsPage[qnum].style.display = "none";
    questionsPage[qnum + 1].style.display = "block";
  } else {
    // not on the last page and the answer was incorrect
    questionsPage[qnum + 1].children[2].textContent = "Wrong!"
    // turn off current question, move to next question
    questionsPage[qnum].style.display = "none";
    questionsPage[qnum + 1].style.display = "block";
    // assess penalty
    timeLeft -= 10;
    if (timeLeft < 0) {
      // don't allow negative scores
      timeLeft = 0;
      // stop timer and display "finished" page
      clearInterval(timeInterval);
      displayFinal();
    }
  }
});

// TODO Add keypress (Enter/Return) listener to the initials input box too (same function)
// When clicked or pressing Return write the initials and score to the scores array
// Then display the top 3 scores on the board

var submitEl = document.querySelector("#finished input[type=submit]");
var clearScoresBtnEl = document.getElementById("clear-scores");

// get initials from the form, update high scores (calling function), display high score page
function getInitials() {
  // check to see if user entered initials; if not, give an alert and return
  if (initialsEl.value == "") {
    alert("Please enter your initials.");
    return;
  }

  // update scores in memory and local storage
  updateScores(initialsEl.value, timeLeft);

  // update the high scores page
  writeScoresPage();

  // clear the initials
  initialsEl.value = "";

  // turn off the "finished page" and turn on the "high scores" page
  finishedPageEl.style.display = "none";
  highScoresPageEl.style.display = "block";
}

submitEl.addEventListener("click", getInitials);

clearScoresBtnEl.addEventListener("click", clearScores);
