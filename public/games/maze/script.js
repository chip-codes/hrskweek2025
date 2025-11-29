let timerInterval = null;
let timeElapsed = 0;

// === Maze Popup Elements ===
const mazePopup = document.getElementById("maze-popup");

const mazePopupMoves = mazePopup.querySelector(".popup-moves");
const mazePopupTime = mazePopup.querySelector(".popup-time");
const mazePopupOk = document.getElementById("mazeOk");

function startTimer() {
    // Stop any existing timer
    stopTimer(); 

    // Reset time
    timeElapsed = 0;
    document.getElementById("instructions").innerText =
        "Time: 0s – Use arrow keys to lead Hiragi to Sako!";

    // Start counting every second
    timerInterval = setInterval(() => {
        timeElapsed++;
        document.getElementById("instructions").innerText =
            `Time: ${timeElapsed}s – Use arrow keys to lead Hiragi to Sako!`;
    }, 1000);
}

function updateTimer() {
    document.getElementById("timer").innerText = `Time: ${timeElapsed}s`;
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

function rand(max) {
    return Math.floor(Math.random() * max);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function changeBrightness(factor, sprite) {
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500);

    var imgData = context.getImageData(0, 0, 500, 500);

    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = imgData.data[i] * factor;
        imgData.data[i + 1] = imgData.data[i + 1] * factor;
        imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }
    context.putImageData(imgData, 0, 0);

    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
}

// for display in popup
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Show the popup
function showMazePopup(moves, timeElapsed) {
    mazePopupMoves.textContent = `Moves: ${moves}`;
    mazePopupTime.textContent = `Time: ${formatTime(timeElapsed)}`;
    mazePopup.classList.remove("hidden");
}

// Close popup
mazePopupOk.addEventListener("click", () => {
    mazePopup.classList.add("hidden");
    location.reload(); // or go to next level
});

function displayVictoryMess(moves) {
    stopTimer();
    showMazePopup(moves, timeElapsed);
}

function toggleVisablity(id) {
    if (document.getElementById(id).style.visibility == "visible") {
        document.getElementById(id).style.visibility = "hidden";
    } else {
        document.getElementById(id).style.visibility = "visible";
    }
}

function Maze(Width, Height) {
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s", "e", "w"];
    var modDir = {
        n: {
            y: -1,
            x: 0,
            o: "s"
        },
        s: {
            y: 1,
            x: 0,
            o: "n"
        },
        e: {
            y: 0,
            x: 1,
            o: "w"
        },
        w: {
            y: 0,
            x: -1,
            o: "e"
        },
    };

    this.map = function() {
        return mazeMap;
    };
    this.startCoord = function() {
        return startCoord;
    };
    this.endCoord = function() {
        return endCoord;
    };

    function genMap() {
        mazeMap = new Array(height);
        for (let y = 0; y < height; y++) {
            mazeMap[y] = new Array(width);
            for (let x = 0; x < width; ++x) {
                mazeMap[y][x] = {
                    n: false,
                    s: false,
                    e: false,
                    w: false,
                    visited: false,
                    priorPos: null
                };
            }
        }
    }

    function defineMaze() {
        var isComp = false;
        var move = false;
        var cellsVisited = 1;
        var numLoops = 0;
        var maxLoops = 0;
        var pos = { x: 0, y: 0 };  // x = column, y = row
        var numCells = width * height;

        while (!isComp) {
            move = false;
            mazeMap[pos.y][pos.x].visited = true;

            if (numLoops >= maxLoops) {
                shuffle(dirs);
                maxLoops = Math.round(rand(height / 8));
                numLoops = 0;
            }
            numLoops++;

            for (let index = 0; index < dirs.length; index++) {
                var direction = dirs[index];
                var nx = pos.x + modDir[direction].x;
                var ny = pos.y + modDir[direction].y;

                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    //Check if the tile is already visited
                    if (!mazeMap[ny][nx].visited) { 
                        //Carve through walls from this tile to next
                        mazeMap[pos.y][pos.x][direction] = true;
                        mazeMap[ny][nx][modDir[direction].o] = true;

                        //Set Currentcell as next cells Prior visited
                        mazeMap[ny][nx].priorPos = pos;
                        //Update Cell position to newly visited location
                        pos = { x: nx, y: ny };
                        cellsVisited++;
                        //Recursively call this method on the next tile
                        move = true;
                        break;
                    }
                }
            }

            if (!move) {
            // backtrack
            var prior = mazeMap[pos.y][pos.x].priorPos;
            if (prior) {
                pos = { x: prior.x, y: prior.y };
            } else {
                // fallback (shouldn't normally happen)
                // find any unvisited cell to continue (optional)
                break;
            }
        }

            if (numCells == cellsVisited) {
                isComp = true;
            }
        }
    }

    function defineStartEnd() {
        switch (rand(4)) {
            case 0:
                startCoord = {
                    x: 0,
                    y: 0
                };
                endCoord = {
                    x: width - 1,
                    y: height - 1
                };
                break;
            case 1:
                startCoord = {
                    x: 0,
                    y: height - 1
                };
                endCoord = {
                    x: width - 1,
                    y: 0
                };
                break;
            case 2:
                startCoord = {
                    x: width - 1,
                    y: 0
                };
                endCoord = {
                    x: 0,
                    y: height - 1
                };
                break;
            case 3:
                startCoord = {
                    x: width - 1,
                    y: height - 1
                };
                endCoord = {
                    x: 0,
                    y: 0
                };
                break;
        }
    }

    genMap();
    defineStartEnd();
    defineMaze();
}

function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 40;

    this.redrawMaze = function(size) {
       cellSize = size;
       ctx.lineWidth = cellSize / 50;
       drawMap();
       drawEndMethod();
    };

    function drawCell(xCord, yCord, cell) {
        var x = xCord * cellSize;
        var y = yCord * cellSize;

        if (cell.n == false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        if (cell.s === false) {
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.e === false) {
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (cell.w === false) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
    }

    function drawMap() {
    // map is maze.map() which is mazeMap (height rows)
    var rows = map.length;       // height
    var cols = map[0].length;    // width
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            drawCell(x, y, map[y][x]);
        }
    }
}

function drawEndFlag() {
    var coord = Maze.endCoord();
    var gridSize = 4;
    var fraction = cellSize / gridSize - 2;
    var colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
        if (gridSize % 2 == 0) {
            colorSwap = !colorSwap;
        }
        for (let x = 0; x < gridSize; x++) {
            ctx.beginPath();
            ctx.rect(
                coord.x * cellSize + x * fraction + 4.5,
                coord.y * cellSize + y * fraction + 4.5,
                fraction,
                fraction
            );
            if (colorSwap) {
                ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
            } else {
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            }
            ctx.fill();
            colorSwap = !colorSwap;
        }
    }
}

function drawEndSprite() {
    var offsetLeft = cellSize / 50;
    var offsetRight = cellSize / 25;
    var coord = Maze.endCoord();
    ctx.drawImage(
        endSprite,
        2,
        2,
        endSprite.width,
        endSprite.height,
        coord.x * cellSize + offsetLeft,
        coord.y * cellSize + offsetLeft,
        cellSize - offsetRight,
        cellSize - offsetRight
    );
}

function clear() {
    var rows = map.length;
    var cols = map[0].length;
    var canvasWidth = cellSize * cols;
    var canvasHeight = cellSize * rows;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}


if (endSprite != null) {
    drawEndMethod = drawEndSprite;
} else {
    drawEndMethod = drawEndFlag;
}

clear();
drawMap();
drawEndMethod();
}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
    var ctx = c.getContext("2d");
    var drawSprite;
    var moves = 0;
    drawSprite = drawSpriteCircle;
    if (sprite != null) {
        drawSprite = drawSpriteImg;
    }
    var player = this;
    var map = maze.map();
    var cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    };
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;

    this.redrawPlayer = function(_cellsize) {
        cellSize = _cellsize;
        drawSpriteImg(cellCoords);
    };

    function drawSpriteCircle(coord) {
        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.arc(
            (coord.x + 1) * cellSize - halfCellSize,
            (coord.y + 1) * cellSize - halfCellSize,
            halfCellSize - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            moves++;
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function drawSpriteImg(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.drawImage(
            sprite,
            0,
            0,
            sprite.width,
            sprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
            moves++;
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function removeSprite(coord) {
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.clearRect(
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    function check(e) {
        var cell = map[cellCoords.y][cellCoords.x];
        //moves++;
        switch (e.keyCode) {
            case 65:
            case 37:  //west
                if (cell.w == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x - 1,
                        y: cellCoords.y
                    };
                    drawSprite(cellCoords);
                    moves++;
                }
                break;
            case 87:
            case 38: // north
                if (cell.n == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x,
                        y: cellCoords.y - 1
                    };
                    drawSprite(cellCoords);
                    moves++;
                }
                break;
            case 68:
            case 39: // east
                if (cell.e == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x + 1,
                        y: cellCoords.y
                    };
                    drawSprite(cellCoords);
                    moves++;
                }
                break;
            case 83:
            case 40: // south
                if (cell.s == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x,
                        y: cellCoords.y + 1
                    };
                    drawSprite(cellCoords);
                    moves++;
                }
                break;
        }
    }

    this.bindKeyDown = function() {
        window.addEventListener("keydown", check, false);

        $("#view").swipe({
            swipe: function(
                event,
                direction,
                distance,
                duration,
                fingerCount,
                fingerData
            ) {
                console.log(direction);
                switch(direction) {
                    case "up":
                        check({
                            keyCode: 38
                        });
                        break;
                    case "down":
                        check({
                            keyCode: 40
                        });
                        break;
                    case "left":
                        check({
                            keyCode: 37
                        });
                        break;
                    case "right":
                        check({
                            keyCode: 39
                        });
                        break;
                }
            },
            threshold: 0
        });
    };

    this.unbindKeyDown = function() {
        window.removeEventListener("keydown", check, false);
        $("#view").swipe("destroy");
    };

    drawSprite(maze.startCoord());

    this.bindKeyDown();
}

var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;
// sprite.src = 'media/sprite.png'

window.onload = function() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }

    // Load and edit sprite
    var completeOne = false;
    var completeTwo = false;

    sprite = new Image();
    sprite.src = "hiragi.png?" + new Date().getTime();
    sprite.onload = function() {
        sprite = changeBrightness(1.2, sprite);
        completeOne = true;
        console.log("Hiragi loaded:", completeOne);
    };

    finishSprite = new Image();
    finishSprite.src = "sako.png?" + new Date().getTime();
    finishSprite.onload = function() {
        finishSprite = changeBrightness(1.2, finishSprite);
        completeTwo = true;
        console.log("Sako loaded:", completeTwo);
    };
};

window.onresize = function() {
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - viewHeight / 100;
        ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
        ctx.canvas.width = viewWidth - viewWidth / 100;
        ctx.canvas.height = viewWidth - viewWidth / 100;
    }

     cellSize = mazeCanvas.width / difficulty;
     if (player != null) {
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
     }
};

function makeMaze() {
    if (player != undefined) {
        player.unbindKeyDown();
        player = null;
    }
    var e = document.getElementById("diffSelect");
    difficulty = parseInt(e.value);
    cellSize = mazeCanvas.width / difficulty;
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
    if (document.getElementById("mazeContainer").style.opacity < "100") {
        document.getElementById("mazeContainer").style.opacity = "100";
    }
}

function startMaze() {
    startTimer();  // start counting time
    makeMaze();    // generate the maze and player
}


// MOBILE ARROW BUTTONS — reliable dispatch for native keydown handlers
document.querySelectorAll(".arrow-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const dir = btn.getAttribute("data-dir");
        let code = 0;

        switch (dir) {
            case "up": code = 38; break;    // ArrowUp
            case "down": code = 40; break;  // ArrowDown
            case "left": code = 37; break;  // ArrowLeft
            case "right": code = 39; break; // ArrowRight
            default: return;
        }

        // create KeyboardEvent and ensure keyCode/which present for native handlers
        const evt = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: (code === 38 ? "ArrowUp" : code === 40 ? "ArrowDown" : code === 37 ? "ArrowLeft" : "ArrowRight"),
            code: (code === 38 ? "ArrowUp" : code === 40 ? "ArrowDown" : code === 37 ? "ArrowLeft" : "ArrowRight"),
            which: code,
            keyCode: code,
        });

        // Some browsers make keyCode/which read-only; force properties so native listeners can read them
        try {
            Object.defineProperty(evt, 'keyCode', { get: () => code });
            Object.defineProperty(evt, 'which', { get: () => code });
        } catch (e) {
            // ignore if not allowed
        }

        window.dispatchEvent(evt);
    });
});

/* 
left = 37
up = 38
right = 39
down = 40 
*/