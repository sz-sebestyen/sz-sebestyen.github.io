function _pageLoad() {
  let startButton = document.querySelector("#start-button");
  startButton.addEventListener("click", startCountdown);

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "s" &&
      document.getElementById("start-button").disabled == false
    ) {
      startCountdown();
    }
  });

  checkLocalHighscore();
}
window.addEventListener("load", _pageLoad);

// no need for these
//let count;
//let countInterval;

function startCountdown() {
  document.getElementById("start-button").disabled = true;
  setTimeout(startGame, 4000);

  let count = 3;

  // a függvény látja a count áltozót
  function countdownText() {
    let countdown = document.getElementById("countdown");
    countdown.innerHTML = `Game starts in <br><span class="number">${count}</span> ..`;
    countdown.classList.remove("dissapear");
    count--;

    /* another solution in line 42, no global variable needed
    if (count === -1) {
      clearInterval(countInterval);
      countdown.classList.add("dissapear");
    }
    */
  }

  let countInterval = setInterval(countdownText, 1000);

  // négy másodperc múlva leállítja
  setTimeout(() => {
    clearInterval(countInterval);
    countdown.classList.add("dissapear");
  }, 4000);

  // don't delete, I don't know why this helps with
  // the first appearance of the svg to not be in the corner
  const svg = document.getElementById("target");
  svg.setAttribute("height", 50);
  svg.classList.remove("hidden");
  svg.classList.add("hidden");
  const death = document.getElementById("death-animation");
  death.setAttribute("height", parseFloat(svg.getAttribute("height")));
  death.classList.remove("hidden");
  death.classList.add("hidden");
  changeTargetLocation();
  highScoreReset();
}

function startGame() {
  console.log("started game");
  //startTimer();
  showTarget();
  timerInterval();
  scoreReset();
}

// no need for these
//let timeLeft;
//let myInterval;

function timerInterval() {
  let timeLeft = 10;

  // a függvény látja a timeLeft változót
  function startTimer() {
    //start countdown, if run out of time -> gameover
    if (timeLeft > 0) {
      let remTime = document.getElementById("rem-time");
      timeLeft--;
      remTime.innerHTML = `<span class="number">${timeLeft}</span>`;
      console.log("started timer");
      //game over
      if (timeLeft === 0) {
        gameOver();
      }
    }
  }

  let myInterval = setInterval(startTimer, 1000);

  // 10 másodperc múlva állítsa le
  setTimeout(function () {
    clearInterval(myInterval);
  }, 10000);
}

function showTarget() {
  console.log("show target");

  const svg = document.getElementById("target");

  const ani = document.getElementById("death-animation");
  ani.classList.remove("hidden");
  ani.classList.add("svg-animated-reverse");

  setTimeout(() => {
    svg.classList.remove("hidden");
    ani.classList.add("hidden");
    ani.classList.remove("svg-animated-reverse");
  }, 1000);

  const target = document.getElementById("circle");
  target.addEventListener("mouseover", updateTarget);
  target.addEventListener("touchstart", updateTarget); // for mobile
  target.addEventListener("mouseover", updateScore);
  target.addEventListener("touchstart", updateScore); // for mobile
}

function changeTargetLocation() {
  console.log("change target location");

  const board = document.querySelector(".board");
  const svg = document.getElementById("target");

  const inset = parseFloat(svg.getAttribute("height"));

  // add a minimum distance of 200px
  const oldTop = parseFloat(svg.style.top);
  const oldLeft = parseFloat(svg.style.left);

  let newTop;
  let newLeft;
  do {
    newTop = roundToTwo(Math.random() * (board.offsetHeight - inset));
    newLeft = roundToTwo(Math.random() * (board.offsetWidth - inset));
  } while (
    oldLeft !== NaN &&
    Math.pow(oldTop - newTop, 2) + Math.pow(oldLeft - newLeft, 2) < 40000 // 200px
  );

  svg.style.top = newTop;
  svg.style.left = newLeft;

  // fit animation
  const death = document.getElementById("death-animation");
  death.style.top = svg.style.top;
  death.style.left = svg.style.left;
}

function roundToTwo(floatNum) {
  return Math.round((floatNum + Number.EPSILON) * 100) / 100;
}

function changeTargetSize() {
  const multipicator = 0.93;
  const svg = document.getElementById("target");

  svg.setAttribute(
    "height",
    roundToTwo(parseFloat(svg.getAttribute("height")) * multipicator)
  );

  // fit animation
  const death = document.getElementById("death-animation");
  death.setAttribute("height", parseFloat(svg.getAttribute("height")));
}

function updateTarget() {
  console.log("update target");

  // prevent capture during updating location
  const target = document.getElementById("circle");
  target.removeEventListener("mouseover", updateTarget);
  setTimeout(() => {
    target.addEventListener("mouseover", updateTarget);
  }, 300);

  changeTargetLocation();
  changeTargetSize();
}

function updateScore() {
  //maybe highscore also here idk
  console.log("update score");
  let currentScore = document.getElementById("current-score");

  let aScore = parseInt(
    document.querySelector("#current-score span").innerHTML
  );
  currentScore.innerHTML = `<span class="number">${++aScore}</span>`;
}

function setLocalHighscore(aScore) {
  if (!sessionStorage["localHighscore"]) {
    sessionStorage.setItem("localHighscore", aScore);
    newHighscore();
  } else if (aScore > sessionStorage.getItem("localHighscore")) {
    sessionStorage.setItem("localHighscore", aScore);
    newHighscore();
  } else {
    gameOverText();
  }
}

function checkLocalHighscore() {
  if (!sessionStorage["localHighscore"]) {
    let highScore = 0;
    let hScore = document.getElementById("high-score");
    hScore.innerHTML = `<span class="number">${highScore}</span>`;
  } else {
    let highScore = sessionStorage.getItem("localHighscore");
    let hScore = document.getElementById("high-score");
    hScore.innerHTML = `<span class="number">${highScore}</span>`;
  }
}

function scoreReset() {
  let currentScore = document.getElementById("current-score");
  currentScore.innerHTML = `<span class="number">0</span>`;
}

function newHighscore() {
  let highScoreText = document.getElementById("high-score-text");
  highScoreText.classList.remove("dissapear");
  highScoreText.classList.add("activeHs");

  let highScoreNumber = document.getElementById("high-score-number");
  highScoreNumber.classList.remove("dissapear");
  highScoreNumber.classList.add("activeHs2");

  let aScore = document.querySelector("#current-score span").innerHTML;

  highScoreNumber.innerHTML = `<span class="number">${aScore}</span>`;
}
function highScoreReset() {
  document.getElementById("high-score-text").classList.add("dissapear");
  document.getElementById("high-score-number").classList.add("dissapear");
  document.getElementById("game-over-text").classList.add("dissapear");
}

function gameOverText() {
  let gameOverText = document.getElementById("game-over-text");
  gameOverText.classList.remove("dissapear");
  gameOverText.classList.add("activeHs");
}

function gameOver() {
  console.log("game over");

  const target = document.getElementById("circle");
  target.removeEventListener("mouseover", updateTarget);
  target.removeEventListener("touchstart", updateTarget); // for mobile

  const svg = document.getElementById("target");
  svg.classList.add("hidden");

  const death = document.getElementById("death-animation");
  death.classList.remove("hidden");
  death.classList.add("svg-animated");

  setTimeout(() => {
    death.classList.add("hidden");
    death.classList.remove("svg-animated");
  }, 2000);
  let aScore = parseInt(
    document.querySelector("#current-score span").innerHTML
  );
  setLocalHighscore(aScore);
  checkLocalHighscore();

  document.getElementById("start-button").disabled = false;
}
