"use strict";

// Linear time solution. Starting from right.
function drawGrid(ctx, width, height, cells) {
    var squareWidth = width / cells;
    for (var i = 0; i < cells; i++) {
        for (var j = 0; j < cells; j++) {
            if ((j + i) % 2 == 0) {
                ctx.fillStyle = "#C6C6C6";
            } else {
                ctx.fillStyle = "#E8E8E8";
            }
            ctx.fillRect(i * squareWidth, j * squareWidth, squareWidth, squareWidth);
        }
    }
}
// creates a canvas and appends it to the page
function createCanvas(width, height, divId) {
    var stage = document.getElementById(divId);
    var oldcanv = document.getElementById("nQueens-canvas");
    stage.removeChild(oldcanv);
    var canv = document.createElement("canvas");
    canv.id = "nQueens-canvas";
    canv.height = height;
    canv.width = width;
    stage.appendChild(canv);
    var context = canv.getContext('2d');
    drawGrid(context, width, height, 5);
    return context;
}
// Function takes in the width of the board.
function nQueens() {
    var solutions = [];
    var checkBoard = function checkBoard(board, boardSize) {
        // Only check the last queen against previous ones.
        var boardLen = board.length;
        if (boardSize == 1) {
            return true;
        }
        var lastQueen = Number(board[boardLen - 1]);
        for (var distance = 1; distance < boardLen; distance++) {
            if (Math.abs(lastQueen - Number(board[boardLen - 1 - distance])) == distance || lastQueen == Number(board[boardLen - 1 - distance])) {
                return false;
            }
        }
        return true;
    };
    var solver = regeneratorRuntime.mark(function solver(col, boardWidth) {
        var i;
        return regeneratorRuntime.wrap(function solver$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(col.length > 1 && !checkBoard(col, boardWidth))) {
                            _context.next = 5;
                            break;
                        }

                        _context.next = 3;
                        return [false, col];

                    case 3:
                        _context.next = 18;
                        break;

                    case 5:
                        if (!(col.length == boardWidth)) {
                            _context.next = 10;
                            break;
                        }

                        _context.next = 8;
                        return [true, col];

                    case 8:
                        _context.next = 18;
                        break;

                    case 10:
                        i = 0;

                    case 11:
                        if (!(i < boardWidth)) {
                            _context.next = 18;
                            break;
                        }

                        _context.next = 14;
                        return [false, col + i.toString()];

                    case 14:
                        return _context.delegateYield(solver(col + i.toString(), boardWidth), "t0", 15);

                    case 15:
                        i++;
                        _context.next = 11;
                        break;

                    case 18:
                    case "end":
                        return _context.stop();
                }
            }
        }, solver, this);
    });
    return solver;
}
function drawQueens(context, currentSol, size) {
    var drawCircle = function drawCircle(centerX, centerY) {
        context.beginPath();
        context.arc(centerX, centerY, size / 2.2, 0, 2 * Math.PI, false);
        context.fillStyle = '#8594A8';
        context.fill();
        context.closePath();
    };
    var offset = size / 2;
    for (var i = 0; i < currentSol.length; i++) {
        var pos = Number(currentSol[i]);
        drawCircle(i * size + offset, pos * size + offset);
    }
}
function initGameLoop(ctx, side, n, animationNumber) {
    var nQueenGen = nQueens(); //Need to call the generator once.
    var myIterator = nQueenGen("", n);
    var isDone = false;
    var currentIteration = "";
    var thisIteration = void 0;
    var storedSolution = void 0;
    // This is the meat of the program.
    var gameLoop = function gameLoop() {
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
            var correctSolution = thisIteration.value[0];
            var solution = thisIteration.value[1];
            if (!isDone) {
                // // Place pieces on board.
                drawQueens(ctx, solution, side / n);
            } else {
                drawQueens(ctx, storedSolution, side / n);
            }
            if (correctSolution) {
                isDone = true;
                storedSolution = solution;
            }
        }
    };
    gameLoop(); // Initiates the loop
}
// Very rough.
function reset() {
    var side = 400;
    var ctx = createCanvas(side, side, "canvas-nqueens");
    var nInput = document.getElementById("nQueens-n");
    var n = parseInt(nInput.value);
    if (n < 4 || !n) {
        n = 4;
    } else if (n > 10) {
        n = 10;
    }
    globalNumber++;
    initGameLoop(ctx, side, n, globalNumber);
}
// Global vars
var globalNumber = 0;
// Event Handlers
var submitButton = document.getElementById("btn-submit");
submitButton.addEventListener("click", function () {
    reset();
});
// Just run this once to get a nice board.
(function () {
    var side = 400;
    var ctx = createCanvas(side, side, "canvas-nqueens");
})();