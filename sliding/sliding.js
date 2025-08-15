var rows = 3;
var columns = 3;
var turns = 0;
var timerInterval;
var secondsElapsed = 0;
var firstMoveMade = false;

var solvableOrders = [
    ["h4", "h1", "h3", "h7", "h2", "h6", "h5", "h8", "h9"],
    ["h2", "h3", "h6", "h1", "h5", "h9", "h4", "h7", "h8"],
    ["h7", "h2", "h4", "h5", "h9", "h6", "h1", "h8", "h3"],
    ["h6", "h1", "h8", "h7", "h5", "h3", "h4", "h2", "h9"],
    ["h4", "h2", "h8", "h5", "h1", "h6", "h7", "h9", "h3"]
];
var imgOrder = [];

window.onload = function () {
    initBoard();
    document.getElementById("shuffleButton").addEventListener("click", resetGame);
};

function initBoard() {
    imgOrder = [...solvableOrders[Math.floor(Math.random() * solvableOrders.length)]];
    let board = document.getElementById("board");
    board.innerHTML = "";
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r + "-" + c;
            tile.src = "image/" + imgOrder.shift() + ".jpg";
            tile.addEventListener("click", tileClick);
            board.append(tile);
        }
    }
}

function tileClick() {
    let clickedTile = this;
    let blankTile = [...document.querySelectorAll("#board img")].find(img =>
        img.src.includes("h3.jpg")
    );

    if (isAdjacent(clickedTile, blankTile)) {
        if (!firstMoveMade) {
            firstMoveMade = true;
            startTimer();
        }
        swapTiles(clickedTile, blankTile);
        turns++;
        document.getElementById("turns").innerText = turns;
    }
}

function isAdjacent(tile1, tile2) {
    let [r1, c1] = tile1.id.split("-").map(Number);
    let [r2, c2] = tile2.id.split("-").map(Number);
    return (
        (r1 === r2 && Math.abs(c1 - c2) === 1) ||
        (c1 === c2 && Math.abs(r1 - r2) === 1)
    );
}

function swapTiles(tile1, tile2) {
    let tempSrc = tile1.src;
    tile1.src = tile2.src;
    tile2.src = tempSrc;
}

function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        let minutes = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
        let seconds = String(secondsElapsed % 60).padStart(2, "0");
        document.getElementById("timer").innerText = `${minutes}:${seconds}`;
    }, 1000);
}

function resetGame() {
    clearInterval(timerInterval);
    timerInterval = null;
    secondsElapsed = 0;
    firstMoveMade = false;
    turns = 0;
    document.getElementById("turns").innerText = turns;
    document.getElementById("timer").innerText = "00:00";
    initBoard();
}
