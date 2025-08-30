document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("gameBoard");
    const shuffleButton = document.getElementById("shuffleButton");
    const moveCounter = document.getElementById("moveCounter");
    const timerElement = document.getElementById("timer");

    let tiles = [];
    let emptyIndex = 8;
    let moveCount = 0;
    let timer, seconds = 0;

    // Use your own images
    const images = [
        "image/h1.jpg",
        "image/h2.jpg",
        "image/h4.jpg",
        "image/h5.jpg",
        "image/h6.jpg",
        "image/h7.jpg",
        "image/h8.jpg",
        "image/h9.jpg",
        "" // empty slot
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
            tileElement.addEventListener("click", () => moveTile(index));
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
        alert("Congratulations! You solved the puzzle!");
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

    shuffleButton.addEventListener("click", () => {
        shuffleTiles();
        moveCount = 0;
        moveCounter.textContent = moveCount;
        stopTimer();
        seconds = 0;
        timerElement.textContent = "00:00";
        startTimer();
});

generateGrid();
shuffleTiles();
startTimer();

});
