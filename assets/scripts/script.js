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

// load the scores from local storage into memory
function loadScores() {
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

// save scores from memory to local storage
function saveScores() {
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
    scores.push({ initials: initials, score: score });
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
function sortScores() {
  if (scores.length > 1) {
    scores.sort(function(a, b) { return b.score - a.score; });
  }
}

// update the high score page with the scores array values
function writeScoresPage() {
  // sort the scores before displaying
  sortScores();

  // write to the scores page
  for (var i = 0; i < scores.length; i++) {
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
  for (var i = 0; i < scoreListEl.length; i++) {
    scoreListEl[i].textContent = "";
  }
}

///////////////////////////////////////////////////////////////////////////////
//                               Quiz Questions                              //
///////////////////////////////////////////////////////////////////////////////

// First retrieve an array of all sections containing questions
// Only one of these sections will have visible elements at any give time
// As the user submits answers, we progress through the array

/*********************
 * TODO add routine to scramble the question order
 * TODO add routine to scamble the answers within a question
 * TODO add more questions (20 or more) and sample five of them for the quiz
 * TODO add more flexibility to the quiz: user can choose number of questions
 * - start time will be det'd automatically
 * - high scores will be based on avg time per question, or something similar
 * - default to 5 questions (and 75 sec)
 *
 * Write a function to obtain the question number from the event (click) target,
 * which is the button.
 *
 * The advantage of this approach is that randomization and subsampling is easier:
 * - get an array of all section elements
 * - jumble the integers from 0 to length-1, and then assign them to the sections
 * - use the first N questions (five? user choice? See above block)
 *********************/

// retrieve array of sections containing questions
var questionsPage = document.querySelectorAll(".question");

// function to shuffle array elements
// taken from SO: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}
// convenience function to shuffle array indices
// (not sure I will use this...depends how I implement the refactor)
function shuffleIndex(length) {
  var sequence [];
  for (var i=0; i<length; i++) {sequence[i] = i;}
  return shuffle(sequence);
}

/*
 * Turns out I cannot shuffle the questionsPage array directly using the shuffle() function
 * I guess nodes are different? Shuffling (or swapping) seems to have no impact on the array order
 * In order to shuffle I will have to refactor, possibly an array of objects where each object
 * has the question, the choices, and the identify of the correct choice.
 */

// Identify the first question since it is special
var firstQuestionEl = questionsPage[0];

// section element will contain the data attribute identifying its question
// we will use zero-based indexing of questions
for (var i = 0; i < questionsPage.length; i++) {
  questionsPage[i].dataset.qnum = i;
};

///////////////////////////////////////////////////////////////////////////////
//                              Countdown Timer                              //
///////////////////////////////////////////////////////////////////////////////

// set up variables/function for timer
var timeLeft = 75;
var timerEl = document.getElementById("timer");
var timeInterval;    // interval ID; needs to be global in scope

// function for the timer
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
// contains timer functions
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

/*
 * This is the event listener that drives the quiz-taking process.
 * Click target is a button. For the correct answer, the button
 * has a data-attribute data-correct equal to the string "true"
 * The (great grandparent) section containing the button has the
 * question number, which is a zero-based index of the questions.
 */
questionsContainerEl.addEventListener("click", function(evt) {
  // retrieve the button that was selected
  var chosenAnswerEl = evt.target;

  // create variables from data stored with clicked item and its section
  // note the need to convert variable types
  // remember that question number (qnum) is a zero-based index
  var qnum = +chosenAnswerEl.closest(".question").dataset.qnum;
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

// events/functions below are for after the quiz is complete
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

  // reset timer display
  timerEl.textContent = "75";
}

submitEl.addEventListener("click", getInitials);
initialsEl.addEventListener("keydown", function (evt) {
  if (evt.key == "Enter") {getInitials();};
});

clearScoresBtnEl.addEventListener("click", clearScores);
