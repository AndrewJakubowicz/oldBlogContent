"use strict";

// Grabs the canvas and returns the context
// Sets size to 400 px square.
// Attach handlers
function initCanvas(canvasID) {
    var canvas = document.getElementById(canvasID);
    canvas.height = 400;
    canvas.width = 400;
    canvas.addEventListener("mousedown", mouseDownOnCanvas);
    canvas.addEventListener("mouseleave", mouseUpOnCanvas);
    return canvas.getContext('2d');
}
//Also clear the interval when user leaves the window with mouse
document.addEventListener("mouseout", mouseUpOnCanvas);
document.addEventListener("mouseup", mouseUpOnCanvas);
document.addEventListener("mousemove", mouseCaptureMove);
// Draws the maze.
// Literally works out how big to draw the maze based on the shape of the mazeString.
function drawGrid(ctx, width, height, mazeString) {
    var cellsSplit = mazeString;
    var cells = cellsSplit.length;
    var squareWidth = width / cells;
    for (var i = 0; i < cells; i++) {
        for (var j = 0; j < cells; j++) {
            if (cellsSplit[j][i] == '#') {
                ctx.fillStyle = "#636363";
            } else if (cellsSplit[j][i] == 'X') {
                ctx.fillStyle = "#ff0000";
            } else if (cellsSplit[j][i] == 'o') {
                ctx.fillStyle = "#00ff00";
            } else if (isNumeric(cellsSplit[j][i])) {
                ctx.fillStyle = "rgb(255,162," + (Number(cellsSplit[j][i]) % 250).toString() + ")";
            } else {
                ctx.fillStyle = "#efefef";
            }
            ctx.fillRect(i * squareWidth, j * squareWidth, squareWidth, squareWidth);
        }
    }
}
function drawSolution(ctx, width, height) {
    var solveBox = void 0;
    var squareWidth = width / globalState.userMaze.length;
    var frameLength = 30;
    var frame = 0;
    var answerLength = globalState.actualSolution.length;
    // Initiate drawing solution.
    globalState.drawingSolution = true;
    var drawSolution = function drawSolution() {
        if (globalState.actualSolution.length != 0 && globalState.drawingSolution) {
            requestAnimationFrame(drawSolution);
            while (globalState.actualSolution.length != 0 && globalState.actualSolution.length / answerLength > 1 - animationEase("linear", frameLength, frame)) {
                solveBox = globalState.actualSolution.pop();
                ctx.fillStyle = "rgb(" + (Number(frame) * 8 % 250).toString() + ",162,255)";
                ctx.fillRect(solveBox[1] * squareWidth, solveBox[0] * squareWidth, squareWidth, squareWidth);
            }
            frame++;
            if (globalState.actualSolution.length == 0) {
                globalState.drawingSolution = false;
            }
        } else {
            globalState.drawingSolution = false;
        }
    };
    drawSolution();
}
// This will get you your animation moment. Wherever you are.
// Returns a float, shows distance between 0 and 1.
function animationEase(type, frameLength, frame) {
    var y = void 0;
    var t = frame / frameLength;
    if (type /* == "linear" */) {
            // y = mx + c (m = 0, c = 0)
            // y = scrubPosition
            // Smooth function
            y = -t * (t - 2);
        }
    // This makes sure that we cap the animation at 1.
    if (y > 1) {
        return 1;
    } else if (y < 0) {
        return 0;
    }
    return y;
}
// Initiates the whole thing.
// Global controllers
var animationRunning = true;
var globalState = {
    userMaze: "#######-----###-----w------#------------Xw------#------------#w#-----#####-########w#-------#----------#w#-#####-########---#w#-#---#-#-#------###w#-#-#-#-#-#-##-#####w#-#-#-#-#-#------###w#-#-#-#-#-######-###w#-#-#-#-#-#------###w#-#-#-#-#-#-########w#-#-#-#-#-#------###w#-#-#-#-#-######-###w#-#-#-#-#-#------###w#-#-#-#-#-#-########w#-#-#-#-#-#------###wo-#-###----#####---#w--------##-##------#w###--####---------##".split("w").map(function (v) {
        return v.trim().split('');
    }),
    editorMode: false,
    mouseCood: [0, 0],
    mouseDownInterval: null,
    editState: "",
    actualSolution: [],
    drawingSolution: false
};
// Initiates everything
var cvs = initCanvas("mazeSolver-canvas");
// HARDCODED - initates first canvas drawing.
drawGrid(cvs, 400, 400, globalState.userMaze);
// Game loop of the file.
function gameLoop(ctx) {
    // Grab maze from global object.
    var maze = globalState.userMaze.map(function (x) {
        return x.join('');
    }).join('\n');
    var height = 400;
    var width = 400;
    // Sets up the editor.
    var drawEditorMode = function drawEditorMode() {
        // First check where the first mouseDown was.
        if (globalState.editState == "") {
            setEditorState(width);
        }
        userUpdateMaze(width);
        drawGrid(ctx, width, height, globalState.userMaze);
    };
    // Actual game loop. Here we choose who gets animated.
    if (globalState.editorMode) {
        drawEditorMode();
    } else {
        (function () {
            // Initial set up for the runningMaze.
            var myIterator = solveMaze(maze);
            var thisIteration = void 0;
            // resets solution
            globalState.actualSolution = [];
            // Runs animation of solving.
            var runningMaze = function runningMaze() {
                // Only generate next frame if we are animating!
                if (animationRunning) {
                    requestAnimationFrame(runningMaze);
                } else if (globalState.editorMode) {
                    requestAnimationFrame(drawEditorMode);
                }
                var thisIteration = myIterator.next();
                if ((!thisIteration.done || animationRunning) && !(thisIteration.value == undefined)) {
                    // Magic maze solving goes on here.
                    var correctSolution = thisIteration.value[0];
                    var solution = thisIteration.value[1];
                    if (correctSolution) {
                        animationRunning = false;
                    }
                    if (animationRunning) {
                        drawGrid(ctx, width, height, solution);
                    } else if (!globalState.editorMode) {
                        // this is the last frame of the animation.
                        drawSolution(ctx, width, height);
                    }
                } else {
                    // console.log("You blocked me in MATE!");
                    animationRunning = false;
                }
            };
            runningMaze();
        })();
    }
}
// This is where the user can update the maze.
function userUpdateMaze(sideLength) {
    // We need to lock the mouse position into the different squares.
    var mouse = findIndex(sideLength);
    var xIndex = mouse[0];
    var yIndex = mouse[1];
    // Currently do not allow users to change starting positions.
    var tileMouseOver = globalState.userMaze[yIndex][xIndex];
    if (tileMouseOver == 'o' || tileMouseOver == 'X' || globalState.editState == 'o' || globalState.editState == 'X') {
        // GET OUT if over start or end.
        return undefined;
    } else {
        globalState.userMaze[yIndex][xIndex] = globalState.editState;
    }
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function updateMazeNumbers(mazeToUpdate) {
    var updateNum = void 0;
    for (var i = 0; i < mazeToUpdate.length; i++) {
        for (var j = 0; j < mazeToUpdate.length; j++) {
            if (isNumeric(mazeToUpdate[i][j])) {
                updateNum = parseFloat(mazeToUpdate[i][j]) + 1;
                mazeToUpdate[i][j] = String(updateNum);
            }
        }
    }
    return mazeToUpdate;
}
// Detects if you click on a wall, empty space, start/end
// Enums would be awesome. Maybe in the future.
function setEditorState(sideLength) {
    // We need to lock the mouse position into the different squares.
    var mouse = findIndex(sideLength);
    var xIndex = mouse[0];
    var yIndex = mouse[1];
    var clickedOn = globalState.userMaze[yIndex][xIndex];
    if (clickedOn == '#') {
        globalState.editState = '-';
    } else {
        globalState.editState = '#';
    }
}
// Normalises the mouse position into an index that we can use.
function findIndex(sideLength) {
    var squaresNumber = globalState.userMaze.length;
    var squareSideSize = sideLength / squaresNumber;
    var xIndex = Math.floor(globalState.mouseCood[0] / squareSideSize);
    var yIndex = Math.floor(globalState.mouseCood[1] / squareSideSize);
    return [xIndex, yIndex];
}
/* SolveMaze takes in a maze, that MUST BE A SQUARE.
 * Will return an iterator that shows the computer solving
 * the maze using backtracking. The maze must have an:
 *  o = start of the maze.
 *  X = end of the maze.
 *  # = walls.
 *  - = empty spaces.
 *  The maze will not go off the edge.
 * SIDE EFFECTS: plays with globalState object.
*/
function solveMaze(myMaze) {
    // Leave a trail of numbers that can increment with time!
    var recursiveSolver = regeneratorRuntime.mark(function recursiveSolver(maze, currentPos) {
        var posRow, posCol, updatedMaze, popped;
        return regeneratorRuntime.wrap(function recursiveSolver$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // Check base case
                        posRow = currentPos[0];
                        posCol = currentPos[1];

                        if (!(posRow < 0 || posRow >= maze.length || posCol < 0 || posCol >= maze.length)) {
                            _context.next = 5;
                            break;
                        }

                        _context.next = 32;
                        break;

                    case 5:
                        if (!(maze[posRow][posCol] == 'X')) {
                            _context.next = 13;
                            break;
                        }

                        maze[posRow][posCol] = '1';
                        // console.log("good job scotty.")
                        _context.next = 9;
                        return [true, maze];

                    case 9:
                        _context.next = 11;
                        return [true, maze];

                    case 11:
                        _context.next = 32;
                        break;

                    case 13:
                        if (!(maze[posRow][posCol] == '#')) {
                            _context.next = 16;
                            break;
                        }

                        _context.next = 32;
                        break;

                    case 16:
                        if (!(maze[posRow][posCol] == '-' || maze[posRow][posCol] == 'o')) {
                            _context.next = 32;
                            break;
                        }

                        // We can travel now.
                        maze[posRow][posCol] = '1';
                        // Here I would like to update the entire maze to get the color effects.
                        updatedMaze = updateMazeNumbers(maze);

                        console.log(updatedMaze);
                        _context.next = 22;
                        return [false, updatedMaze];

                    case 22:
                        // to go up [-1][0]
                        // down [+1][0]
                        // left [0][-1]
                        // right [0][+1]
                        globalState.actualSolution.push([posRow + 1, posCol]);
                        return _context.delegateYield(recursiveSolver(updatedMaze.slice(), [posRow + 1, posCol]), "t0", 24);

                    case 24:
                        globalState.actualSolution.push([posRow - 1, posCol]);
                        return _context.delegateYield(recursiveSolver(updatedMaze.slice(), [posRow - 1, posCol]), "t1", 26);

                    case 26:
                        globalState.actualSolution.push([posRow, posCol + 1]);
                        return _context.delegateYield(recursiveSolver(updatedMaze.slice(), [posRow, posCol + 1]), "t2", 28);

                    case 28:
                        globalState.actualSolution.push([posRow, posCol - 1]);
                        return _context.delegateYield(recursiveSolver(updatedMaze.slice(), [posRow, posCol - 1]), "t3", 30);

                    case 30:
                        _context.next = 32;
                        break;

                    case 32:
                        popped = globalState.actualSolution.pop(); // Throw out the garbage

                    case 33:
                    case "end":
                        return _context.stop();
                }
            }
        }, recursiveSolver, this);
    });
    // Find the start.
    var splitMaze = myMaze.split("\n");
    var startRow = splitMaze.findIndex(function (value) {
        return value.includes('o');
    });
    var startColumn = splitMaze[startRow].indexOf('o');
    var breakApartMap = splitMaze.map(function (value) {
        return value.trim().split('');
    });
    return recursiveSolver(breakApartMap, [startRow, startColumn]);
}
// This is where the mouse magic happens.
function whileMouseDownOnCanvas(event) {
    // This causes a different frame to be loaded.
    globalState.editorMode = true;
    gameLoop(cvs);
}
function mouseCaptureMove(event) {
    event = event || window.event;
    var canvas = document.getElementById('mazeSolver-canvas'),
        x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;
    // Store it globally.
    globalState.mouseCood = [x, y];
}
function mouseDownOnCanvas(event) {
    if (globalState.mouseDownInterval == null) {
        globalState.mouseDownInterval = setInterval(whileMouseDownOnCanvas.bind(window, event), 25);
    }
    globalState.editorMode = true;
    animationRunning = false;
    globalState.drawingSolution = false;
    gameLoop(cvs);
}
function mouseUpOnCanvas(event) {
    clearInterval(globalState.mouseDownInterval);
    globalState.mouseDownInterval = null;
    globalState.editState = "";
}
function runAnimation() {
    animationRunning = true;
    globalState.editorMode = false;
    gameLoop(cvs);
}