const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

let gameActive = false; // cards locked until Start clicked
let timerInterval;
let seconds = 0;

// Buttons
const startBtn = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn");

// Timer element
const timerEl = document.querySelector(".timer"); // make sure you have an element with class "timer"

// Initialize score display
document.querySelector(".score").textContent = score;

// Initialize buttons
startBtn.textContent = "Start Game";
restartBtn.textContent = "Restart";
restartBtn.style.display = "none"; // hide restart initially

// Fetch cards
fetch("data/cards.json")
  .then(res => res.json())
  .then(data => {
      cards = [...data, ...data]; // duplicate for pairs
      shuffleCards();
      generateCards();
  });

// Shuffle cards
function shuffleCards() {
    let currentIndex = cards.length, randomIndex, temp;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        temp = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temp;
    }
}

// Generate card elements
function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card", "disabled"); // start disabled
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src=${card.image} />
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

// Start game
function startGame() {
    if (gameActive) return;
    gameActive = true;
    startTimer();

    // enable all cards
    document.querySelectorAll(".card").forEach(card => card.classList.remove("disabled"));

    // Hide start, show restart
    startBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
}

// Flip card
function flipCard() {
    if (!gameActive) return;
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;

    checkforMatch();
}

// Check match
function checkforMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}

// Disable matched cards
function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    score++;
    document.querySelector(".score").textContent = score;

    if (score === cards.length / 2) {
        clearInterval(timerInterval);
        setTimeout(showPopup, 500);
    }

    resetBoard();
}

// Unflip unmatched cards
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

// Reset board state
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// Restart game
function restart() {
    resetBoard();
    shuffleCards();
    score = 0;
    gameActive = false;
    resetTimer();

    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";
    generateCards();

    // Show Start button, hide Restart button
    startBtn.style.display = "inline-block";
    restartBtn.style.display = "none";
}

// Popup functions
function showPopup() {
    // Set score and time in popup
    document.querySelector(".popup-score").textContent = `Score: ${score}`;
    document.querySelector(".popup-time").textContent = `Time: ${formatTime(seconds)}`;

    document.querySelector(".popup-container").classList.remove("hidden");
}

function closePopup() {
    document.querySelector(".popup-container").classList.add("hidden");
    resetBoard();
    score = 0;
    document.querySelector(".score").textContent = score;

    gridContainer.innerHTML = "";
    generateCards();

    // Show Start button, hide Restart
    startBtn.style.display = "inline-block";
    restartBtn.style.display = "none";

    resetTimer(); // clear any running timer
    gameActive = false;
}

// Timer functions
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        timerEl.textContent = formatTime(seconds);
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    seconds = 0;
    timerEl.textContent = "00:00";
}

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// Event listeners
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restart);
