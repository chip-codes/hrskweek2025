document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("gameBoard");
    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    const moveCounter = document.getElementById("moveCounter");
    const timerElement = document.getElementById("timer");
    const popupContainer = document.querySelector(".popup-container");

    let tiles = [];
    let emptyIndex = 8;
    let moveCount = 0;
    let timer, seconds = 0;
    let gameActive = false; // prevent moves before Start

    // images
    const images = [
        "image/s1.jpg",
        "image/s2.jpg",
        "", // empty slot
        "image/s4.jpg",
        "image/s5.jpg",
        "image/s6.jpg",
        "image/s7.jpg",
        "image/s8.jpg",
        "image/s9.jpg"
    ];

    function generateGrid() {
        tiles = [...images];
        updateGrid();
    }

    function shuffleTiles() {
    do {
        for (let i = tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
        }
    } while (!isSolvable(tiles));
    updateGrid();
}

// Check solvability
function isSolvable(arr) {
    let invCount = 0;
    let flatTiles = arr.filter(tile => tile !== ""); // remove empty

    for (let i = 0; i < flatTiles.length - 1; i++) {
        for (let j = i + 1; j < flatTiles.length; j++) {
            if (images.indexOf(flatTiles[i]) > images.indexOf(flatTiles[j])) {
                invCount++;
            }
        }
    }
    return invCount % 2 === 0; // solvable if even
}

    function updateGrid() {
        gameBoard.innerHTML = "";
        tiles.forEach((tile, index) => {
            const tileElement = document.createElement("div");
            tileElement.classList.add("tile");
            if (tile === "") {
                tileElement.classList.add("empty");
                emptyIndex = index;
            } else {
                tileElement.style.backgroundImage = `url(${tile})`;
            }
            tileElement.addEventListener("click", () => {
                if (gameActive) moveTile(index); // only allow moves when game started
            });
            gameBoard.appendChild(tileElement);
        });
    }

    function moveTile(index) {
        if (isAdjacent(index, emptyIndex)) {
            [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
            emptyIndex = index;
            updateGrid();
            moveCount++;
            moveCounter.textContent = moveCount;
            checkWin();
        }
    }

    function isAdjacent(index1, index2) {
        const row1 = Math.floor(index1 / 3);
        const col1 = index1 % 3;
        const row2 = Math.floor(index2 / 3);
        const col2 = index2 % 3;
        return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    }

    function checkWin() {
    const isSolved = tiles.every((tile, index) => tile === images[index]);
    if (isSolved) {
        stopTimer();
        gameActive = false;

        // Wait a little before showing popup so player can see final image
        setTimeout(() => {
            // update popup stats
            document.querySelector(".popup-moves").textContent = `Moves: ${moveCount}`;
            document.querySelector(".popup-time").textContent = `Time: ${timerElement.textContent}`;

            // show popup
            document.querySelector(".popup-container").classList.remove("hidden");
        }, 500); // 500ms delay (half a second)
    }
}

    function startTimer() {
    stopTimer(); // clear any previous interval before starting a new one
    timer = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;
        timerElement.textContent = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null; // reset to avoid multiple intervals stacking
    }
}

// --- Popup Buttons ---

    // OK button: hide popup AND reset
    document.getElementById("popupOk").addEventListener("click", () => {
        popupContainer.classList.add("hidden");
        shuffleTiles();
        moveCount = 0;
        moveCounter.textContent = moveCount;
        seconds = 0;
        timerElement.textContent = "00:00";
        gameActive = false;
        startButton.disabled = false;
    });

    // Close button (X): hide popup only
    document.querySelector(".popup-close").addEventListener("click", () => {
        popupContainer.classList.add("hidden");
        // do NOT shuffle or reset
    });

    // existing event listeners for Start/Reset buttons
    startButton.addEventListener("click", () => {
        gameActive = true;
        startButton.disabled = true;
        startTimer();
    });

resetButton.addEventListener("click", () => {
    shuffleTiles();
    moveCount = 0;
    moveCounter.textContent = moveCount;
    stopTimer();
    seconds = 0;
    timerElement.textContent = "00:00";
    gameActive = false;
    startButton.disabled = false; // re-enable start button
})

// OK button: hide popup AND reset
document.getElementById("popupOk").addEventListener("click", () => {
    popupContainer.classList.add("hidden");
    shuffleTiles();
    moveCount = 0;
    moveCounter.textContent = moveCount;
    seconds = 0;
    timerElement.textContent = "00:00";
    gameActive = false;
    startButton.disabled = false;
});

// X button: hide popup ONLY
document.querySelector(".popup-close").addEventListener("click", () => {
    popupContainer.classList.add("hidden");
    // do NOT reset or shuffle
});

//     shuffleButton.addEventListener("click", () => {
//         shuffleTiles();
//         moveCount = 0;
//         moveCounter.textContent = moveCount;
//         stopTimer();
//         seconds = 0;
//         timerElement.textContent = "00:00";
//         startTimer();
// });

generateGrid();
shuffleTiles();

});

// Select elements
  const insBtn = document.getElementById('ins');
  const insPopup = document.getElementById('ins-popup');
  const insClose = document.getElementById('ins-close');

  // Open instruction popup
  insBtn.addEventListener('click', () => {
      insPopup.classList.remove('hidden');
  });

  // Close instruction popup
  insClose.addEventListener('click', () => {
      insPopup.classList.add('hidden');
  });

  // Optional: click outside the popup card to close
  insPopup.addEventListener('click', (e) => {
      if (e.target === insPopup) {
          insPopup.classList.add('hidden');
      }
  });