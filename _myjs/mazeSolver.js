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
            else if (isNumeric(cellsSplit[j][i])) {
                ctx.fillStyle = "rgb(255,162," + ((Number(cellsSplit[j][i])) % 250).toString() + ")";
            }
            else {
                ctx.fillStyle = "#E8E8E8";
            }
            ctx.fillRect(i * squareWidth, j * squareWidth, squareWidth, squareWidth);
        }
    }
}
function drawSolution(ctx, width, height) {
    let solveBox;
    let squareWidth = width / globalState.userMaze.length;
    let frameLength = 30;
    let frame = 0;
    let answerLength = globalState.actualSolution.length;
    // Initiate drawing solution.
    globalState.drawingSolution = true;
    var drawSolution = function () {
        if (globalState.actualSolution.length != 0 && globalState.drawingSolution) {
            requestAnimationFrame(drawSolution);
            while (globalState.actualSolution.length != 0 && globalState.actualSolution.length / answerLength > (1 - animationEase("linear", frameLength, frame))) {
                solveBox = globalState.actualSolution.pop();
                ctx.fillStyle = "rgb(" + (Number(frame) * 8 % 250).toString() + ",162,255)";
                ctx.fillRect(solveBox[1] * squareWidth, solveBox[0] * squareWidth, squareWidth, squareWidth);
            }
            frame++;
            if (globalState.actualSolution.length == 0) {
                globalState.drawingSolution = false;
            }
        }
        else {
            globalState.drawingSolution = false;
        }
    };
    drawSolution();
}
// This will get you your animation moment. Wherever you are.
// Returns a float, shows distance between 0 and 1.
function animationEase(type, frameLength, frame) {
    let y;
    let t = frame / frameLength;
    if (type /* == "linear" */) {
        // y = mx + c (m = 0, c = 0)
        // y = scrubPosition
        // Smooth function
        y = -t * (t - 2);
    }
    // This makes sure that we cap the animation at 1.
    if (y > 1) {
        return 1;
    }
    else if (y < 0) {
        return 0;
    }
    return y;
}
// Initiates the whole thing.
// Global controllers
let animationRunning = true;
let globalState = {
    userMaze: "#######-----###-----w------#------------Xw------#------------#w#-----#####-########w#-------#----------#w#-#####-########---#w#-#---#-#-#------###w#-#-#-#-#-#-##-#####w#-#-#-#-#-#------###w#-#-#-#-#-######-###w#-#-#-#-#-#------###w#-#-#-#-#-#-########w#-#-#-#-#-#------###w#-#-#-#-#-######-###w#-#-#-#-#-#------###w#-#-#-#-#-#-########w#-#-#-#-#-#------###wo-#-###----#####---#w--------##-##------#w###--####---------##".split("w").map((v) => { return v.trim().split(''); }),
    editorMode: false,
    mouseCood: [0, 0],
    mouseDownInterval: null,
    editState: "",
    actualSolution: [],
    drawingSolution: false
};
// Initiates everything
let cvs = initCanvas("mazeSolver-canvas");
// HARDCODED - initates first canvas drawing.
drawGrid(cvs, 400, 400, globalState.userMaze);
// Game loop of the file.
function gameLoop(ctx) {
    // Grab maze from global object.
    let maze = globalState.userMaze.map((x) => { return x.join(''); }).join('\n');
    let height = 400;
    let width = 400;
    // Sets up the editor.
    let drawEditorMode = function () {
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
    }
    else {
        // Initial set up for the runningMaze.
        let myIterator = solveMaze(maze);
        let thisIteration;
        // resets solution
        globalState.actualSolution = [];
        // Runs animation of solving.
        let runningMaze = function () {
            // Only generate next frame if we are animating!
            if (animationRunning) {
                requestAnimationFrame(runningMaze);
            }
            else if (globalState.editorMode) {
                requestAnimationFrame(drawEditorMode);
            }
            let thisIteration = myIterator.next();
            if ((!thisIteration.done || animationRunning) && !(thisIteration.value == undefined)) {
                // Magic maze solving goes on here.
                let correctSolution = thisIteration.value[0];
                let solution = thisIteration.value[1];
                if (correctSolution) {
                    animationRunning = false;
                }
                if (animationRunning) {
                    drawGrid(ctx, width, height, solution);
                }
                else if (!globalState.editorMode) {
                    // this is the last frame of the animation.
                    drawSolution(ctx, width, height);
                }
            }
            else {
                // console.log("You blocked me in MATE!");
                animationRunning = false;
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
    let tileMouseOver = globalState.userMaze[yIndex][xIndex];
    if (tileMouseOver == 'o' || tileMouseOver == 'X' || globalState.editState == 'o' || globalState.editState == 'X') {
        // GET OUT if over start or end.
        return undefined;
    }
    else {
        globalState.userMaze[yIndex][xIndex] = globalState.editState;
    }
}
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function updateMazeNumbers(mazeToUpdate) {
    let updateNum;
    for (let i = 0; i < mazeToUpdate.length; i++) {
        for (let j = 0; j < mazeToUpdate.length; j++) {
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
    let mouse = findIndex(sideLength);
    let xIndex = mouse[0];
    let yIndex = mouse[1];
    let clickedOn = globalState.userMaze[yIndex][xIndex];
    if (clickedOn == '#') {
        globalState.editState = '-';
    }
    else {
        globalState.editState = '#';
    }
}
// Normalises the mouse position into an index that we can use.
function findIndex(sideLength) {
    let squaresNumber = globalState.userMaze.length;
    let squareSideSize = sideLength / squaresNumber;
    let xIndex = Math.floor(globalState.mouseCood[0] / squareSideSize);
    let yIndex = Math.floor(globalState.mouseCood[1] / squareSideSize);
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
    let recursiveSolver = function* (maze, currentPos) {
        // Check base case
        let posRow = currentPos[0];
        let posCol = currentPos[1];
        if ((posRow < 0) || (posRow >= maze.length) || (posCol < 0) || (posCol >= maze.length)) {
        }
        else {
            if (maze[posRow][posCol] == 'X') {
                maze[posRow][posCol] = '1';
                // console.log("good job scotty.")
                yield [true, maze];
                yield [true, maze]; // Safety yield (because animation frames run 1 extra);
            }
            else if (maze[posRow][posCol] == '#') {
            }
            else if ((maze[posRow][posCol] == '-') || (maze[posRow][posCol] == 'o')) {
                // We can travel now.
                maze[posRow][posCol] = '1';
                // Here I would like to update the entire maze to get the color effects.
                let updatedMaze = updateMazeNumbers(maze);
                console.log(updatedMaze);
                yield [false, updatedMaze];
                // to go up [-1][0]
                // down [+1][0]
                // left [0][-1]
                // right [0][+1]
                globalState.actualSolution.push([posRow + 1, posCol]);
                yield* recursiveSolver(updatedMaze.slice(), [posRow + 1, posCol]);
                globalState.actualSolution.push([posRow - 1, posCol]);
                yield* recursiveSolver(updatedMaze.slice(), [posRow - 1, posCol]);
                globalState.actualSolution.push([posRow, posCol + 1]);
                yield* recursiveSolver(updatedMaze.slice(), [posRow, posCol + 1]);
                globalState.actualSolution.push([posRow, posCol - 1]);
                yield* recursiveSolver(updatedMaze.slice(), [posRow, posCol - 1]);
            }
            else {
            }
        }
        let popped = globalState.actualSolution.pop(); // Throw out the garbage
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
}
function mouseCaptureMove(event) {
    event = event || window.event;
    var canvas = document.getElementById('mazeSolver-canvas'), x = event.pageX - canvas.offsetLeft, y = event.pageY - canvas.offsetTop;
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
