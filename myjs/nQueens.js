// Linear time solution. Starting from right.
function drawGrid(ctx, width, height, cells) {
    let squareWidth = width / cells;
    ctx.strokeStyle = "black";
    for (let i = 0; i <= cells; i++) {
        ctx.moveTo(0, i * squareWidth);
        ctx.lineTo(width, i * squareWidth);
    }
    for (let i = 0; i <= cells; i++) {
        ctx.moveTo(i * squareWidth, 0);
        ctx.lineTo(i * squareWidth, height);
    }
    ctx.stroke();
}
// creates a canvas and appends it to the page
function createCanvas(width, height, divId) {
    let stage = document.getElementById(divId);
    let oldcanv = document.getElementById("nQueens-canvas");
    stage.removeChild(oldcanv);
    var canv = document.createElement("canvas");
    canv.id = "nQueens-canvas";
    canv.height = height;
    canv.width = width;
    stage.appendChild(canv);
    return canv.getContext('2d');
}
// Function takes in the width of the board.
function nQueens() {
    let solutions = [];
    var checkBoard = function (board, boardSize) {
        // Only check the last queen against previous ones.
        let boardLen = board.length;
        if (boardSize == 1) {
            return true;
        }
        let lastQueen = Number(board[boardLen - 1]);
        for (let distance = 1; distance < boardLen; distance++) {
            if ((Math.abs(lastQueen - Number(board[boardLen - 1 - distance])) == distance) ||
                lastQueen == Number(board[boardLen - 1 - distance])) {
                return false;
            }
        }
        return true;
    };
    let solver = function* (col, boardWidth) {
        //let solution: any = '';
        if (col.length > 1 && !checkBoard(col, boardWidth)) {
            // Do nothing at all
            yield [false, col];
        }
        else if (col.length == boardWidth) {
            yield [true, col]; // Returning solution and finishing generator
        }
        else {
            // Spawn more
            for (let i = 0; i < boardWidth; i++) {
                yield [false, col + i.toString()];
                yield* solver(col + i.toString(), boardWidth);
            }
        }
    };
    return solver;
}
function drawQueens(context, currentSol, size) {
    var drawCircle = function (centerX, centerY) {
        context.beginPath();
        context.arc(centerX, centerY, size / 2, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();
        context.lineWidth = 5;
        context.strokeStyle = '#003300';
        context.stroke();
        context.closePath();
    };
    let offset = size / 2;
    for (let i = 0; i < currentSol.length; i++) {
        let pos = Number(currentSol[i]);
        drawCircle(i * size + offset, pos * size + offset);
    }
}
function initGameLoop(ctx, side, n, animationNumber) {
    let nQueenGen = nQueens(); //Need to call the generator once.
    let myIterator = nQueenGen("", n);
    let isDone = false;
    let currentIteration = "";
    let thisIteration;
    let storedSolution;
    // This is the meat of the program.
    let gameLoop = function () {
        if (!isDone && globalNumber == animationNumber) {
            // Only play another animation if NOT done.
            requestAnimationFrame(gameLoop);
        }
        // Clear board
        ctx.clearRect(0, 0, side, side);
        // Draw board
        drawGrid(ctx, side, side, n);
        // Iterate by 1 step.
        thisIteration = myIterator.next();
        if (!thisIteration.done) {
            let correctSolution = thisIteration.value[0];
            let solution = thisIteration.value[1];
            if (!isDone) {
                // // Place pieces on board.
                drawQueens(ctx, solution, side / n);
            }
            else {
                drawQueens(ctx, storedSolution, side / n);
            }
            if (correctSolution) {
                console.log("A solution: " + solution);
                isDone = true;
                storedSolution = solution;
            }
        }
    };
    gameLoop(); // Initiates the loop
}
// Very rough.
function reset() {
    let side = 400;
    let ctx = createCanvas(side, side, "canvas-nqueens");
    let nInput = document.getElementById("nQueens-n");
    let n = parseInt(nInput.value);
    if (n < 4) {
        n = 4;
    }
    else if (n > 10) {
        n = 10;
    }
    globalNumber++;
    initGameLoop(ctx, side, n, globalNumber);
}
// Global vars
let globalNumber = 0;
// Event Handlers
let submitButton = document.getElementById("btn-submit");
submitButton.addEventListener("click", () => {
    reset();
});
