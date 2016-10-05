// Grabs the canvas and returns the context
// Sets size to 400 px square.
// Attach handlers
function initCanvas(canvasID) {
    let canvas = document.getElementById(canvasID);
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
    let cellsSplit = mazeString;
    let cells = cellsSplit.length;
    let squareWidth = width / cells;
    for (let i = 0; i < cells; i++) {
        for (let j = 0; j < cells; j++) {
            if (cellsSplit[j][i] == '#') {
                ctx.fillStyle = "#C6C6C6";
            }
            else if (cellsSplit[j][i] == 'X') {
                ctx.fillStyle = "#D490CB";
            }
            else if (cellsSplit[j][i] == 'o') {
                ctx.fillStyle = "#90D499";
            }
            else if (cellsSplit[j][i] == '1') {
                ctx.fillStyle = "#FF0000";
            }
            else {
                ctx.fillStyle = "#E8E8E8";
            }
            ctx.fillRect(i * squareWidth, j * squareWidth, squareWidth, squareWidth);
        }
    }
}
function drawGridPlane(ctx, width, height, cells) {
    let squareWidth = width / cells;
    for (let i = 0; i < cells; i++) {
        for (let j = 0; j < cells; j++) {
            if ((j + i) % 2 == 0) {
                ctx.fillStyle = "#C6C6C6";
            }
            else {
                ctx.fillStyle = "#E8E8E8";
            }
            ctx.fillRect(i * squareWidth, j * squareWidth, squareWidth, squareWidth);
        }
    }
}
// Initiates the whole thing.
// Global controllers
let animationRunning = true;
let globalState = {
    userMaze: "######-###    \
\n---------X    \
\n---------#    \
\n######-###    \
\n#--#-----#    \
\n#---##---#    \
\n#---#--###    \
\no-#------#    \
\n---------#    \
\n###-----##".split("\n").map((v) => { return v.trim().split(''); }),
    editorMode: false,
    mouseCood: [0, 0],
    mouseDownInterval: null,
    editState: ""
};
// Initiates everything
let cvs = initCanvas("mazeSolver-canvas");
gameLoop(cvs);
// Game loop of the file.
function gameLoop(ctx) {
    // Grab maze from global object.
    let maze = globalState.userMaze.map((x) => { return x.join(''); }).join('\n');
    let height = 400;
    let width = 400;
    // Sets up the editor.
    let drawEditorMode = function () {
        drawGrid(ctx, width, height, globalState.userMaze);
        // First check where the first mouseDown was.
        if (globalState.editState == "") {
            setEditorState(width);
        }
        userUpdateMaze(width);
    };
    // Actual game loop. Here we choose who gets animated.
    if (globalState.editorMode) {
        drawEditorMode();
    }
    else {
        // Initial set up for the runningMaze.
        let myIterator = solveMaze(maze);
        let thisIteration;
        // Runs animation of solving.
        let runningMaze = function () {
            // Only generate next frame if we are animating!
            if (animationRunning) {
                requestAnimationFrame(runningMaze);
            }
            else if (globalState.editorMode) {
                requestAnimationFrame(drawEditorMode);
            }
            thisIteration = myIterator.next();
            if (!thisIteration.done || animationRunning) {
                let correctSolution = thisIteration.value[0];
                let solution = thisIteration.value[1];
                if (correctSolution) {
                    animationRunning = false;
                    console.log("Animation stopped!");
                }
                drawGrid(ctx, width, height, solution);
            }
        };
        runningMaze();
    }
}
// This is where the user can update the maze.
function userUpdateMaze(sideLength) {
    // We need to lock the mouse position into the different squares.
    let mouse = findIndex(sideLength);
    let xIndex = mouse[0];
    let yIndex = mouse[1];
    // Currently do not allow users to change starting positions.
}
// Detects if you click on a wall, empty space, start/end
// Enums would be awesome. Maybe in the future.
function setEditorState(sideLength) {
    // We need to lock the mouse position into the different squares.
    let mouse = findIndex(sideLength);
    let xIndex = mouse[0];
    let yIndex = mouse[1];
    globalState.editState = globalState.userMaze[yIndex][xIndex];
    console.log("You clicked on:", globalState.editState);
}
// Normalises the mouse position into an index that we can use.
function findIndex(sideLength) {
    let squaresNumber = globalState.userMaze.length;
    let squareSideSize = sideLength / squaresNumber;
    console.log("squares have side length of:", squareSideSize);
    let xIndex = Math.floor(globalState.mouseCood[0] / squareSideSize);
    console.log("x index of: ", xIndex);
    let yIndex = Math.floor(globalState.mouseCood[1] / squareSideSize);
    console.log("y index of: ", yIndex);
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
*/
function solveMaze(myMaze) {
    // Leave a trail of numbers that can increment with time!
    let recursiveSolver = function* (maze, currentPos) {
        // Check base case
        console.log(maze.map((x) => { return x.join(''); }).join('\n'));
        let posRow = currentPos[0];
        let posCol = currentPos[1];
        if ((posRow < 0) || (posRow >= maze.length) || (posCol < 0) || (posCol >= maze.length)) {
            // Do nothing again.
            console.log("Falling off map! EEEK!");
        }
        else {
            if (maze[posRow][posCol] == 'X') {
                maze[posRow][posCol] = '1';
                console.log("good job scotty.");
                yield [true, maze];
            }
            else if (maze[posRow][posCol] == '#') {
                console.log("THis is a wall SHIT!");
            }
            else if ((maze[posRow][posCol] == '-') || (maze[posRow][posCol] == 'o')) {
                // We can travel now.
                maze[posRow][posCol] = '1';
                yield [false, maze];
                // to go up [-1][0]
                // down [+1][0]
                // left [0][-1]
                // right [0][+1]
                yield* recursiveSolver(maze.slice(), [posRow - 1, posCol]);
                yield* recursiveSolver(maze.slice(), [posRow + 1, posCol]);
                yield* recursiveSolver(maze.slice(), [posRow, posCol - 1]);
                yield* recursiveSolver(maze.slice(), [posRow, posCol + 1]);
            }
            else {
                console.log("You're probably standing on a number. Get out of here.");
            }
        }
    };
    // Find the start.
    let splitMaze = myMaze.split("\n");
    let startRow = splitMaze.findIndex((value) => {
        return value.includes('o');
    });
    let startColumn = splitMaze[startRow].indexOf('o');
    let breakApartMap = splitMaze.map((value) => {
        return value.trim().split('');
    });
    return recursiveSolver(breakApartMap, [startRow, startColumn]);
}
// This is where the mouse magic happens.
function whileMouseDownOnCanvas(event) {
    // This causes a different frame to be loaded.
    globalState.editorMode = true;
    gameLoop(cvs);
    // The mouse is down.
    console.log("Mouse down at: ", globalState.mouseCood);
}
function mouseCaptureMove(event) {
    event = event || window.event;
    var canvas = document.getElementById('mazeSolver-canvas'), x = event.pageX - canvas.offsetLeft, y = event.pageY - canvas.offsetTop;
    // Store it globally.
    globalState.mouseCood = [x, y];
}
function mouseDownOnCanvas(event) {
    if (globalState.mouseDownInterval == null) {
        globalState.mouseDownInterval = setInterval(whileMouseDownOnCanvas.bind(window, event), 100);
    }
    globalState.editorMode = true;
    animationRunning = false;
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
