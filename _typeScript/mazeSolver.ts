

// Grabs the canvas and returns the context
// Sets size to 400 px square.
// Attach handlers
function initCanvas(canvasID){
    let canvas = <HTMLCanvasElement>document.getElementById(canvasID);
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
function drawGrid(ctx:CanvasRenderingContext2D, width:number, height:number, mazeString: string[][]):void{
    let cellsSplit = mazeString;
    let cells = cellsSplit.length;
    let squareWidth: number = width / cells;
    for (let i = 0; i < cells; i ++){
        for (let j = 0; j < cells; j ++){
            if (cellsSplit[j][i] == '#'){
                ctx.fillStyle = "#C6C6C6";
            } else if (cellsSplit[j][i] == 'X') {
                ctx.fillStyle = "#D490CB";
            } else if (cellsSplit[j][i] == 'o') {
                ctx.fillStyle = "#90D499";
            } else if (cellsSplit[j][i] == '1') {
                ctx.fillStyle = "#FF0000";
            } else {
                ctx.fillStyle = "#E8E8E8";
            }
            ctx.fillRect(i*squareWidth, j*squareWidth, squareWidth, squareWidth);
        }
    }
}

function drawSolution(ctx, width, height){
    let solveBox;
    ctx.fillStyle = "#00ff00";
    let squareWidth: number = width / globalState.userMaze.length;
    for (let i = 0; i < globalState.actualSolution.length; i++){
        solveBox = globalState.actualSolution[i];
        
        ctx.fillRect(solveBox[1]* squareWidth, solveBox[0] * squareWidth, squareWidth, squareWidth);
    }
}



// Initiates the whole thing.

// Global controllers
let animationRunning = true;

let globalState = {
    userMaze:  "######------###-----    \
\n-------------------X    \
\n--------------#    \
\n#-----#####------###    \
\n#-------#----------#    \
\n#--------##--------#    \
\n#--------#-------###    \
\n#--------#-------###    \
\n#--------#-------###    \
\n#--------#-------###    \
\n#--------#-------###    \
\n#--------#-------###    \
\n#--------#-------###    \
\n#--------#-------###    \
\n#--------#-------###    \
\n#--------#-------###    \
\n#--------#-------###    \
\no-#--------#####---#    \
\n--------#####------#    \
\n###--#####--------##".split("\n").map((v)=>{return v.trim().split('');}),
    editorMode: false,
    mouseCood: [0, 0],
    mouseDownInterval: null,
    editState: "",
    actualSolution: []
};

// Initiates everything
let cvs = initCanvas("mazeSolver-canvas");
// HARDCODED - initates first canvas drawing.
drawGrid(cvs, 400, 400, globalState.userMaze);


// Game loop of the file.
function gameLoop(ctx: CanvasRenderingContext2D):void{
    // Grab maze from global object.
    let maze = globalState.userMaze.map((x)=>{return x.join('');}).join('\n');
    let height = 400;
    let width = 400;
    

    // Sets up the editor.
    let drawEditorMode = function(){
        // First check where the first mouseDown was.
        if (globalState.editState == ""){
            setEditorState(width);
        }
        userUpdateMaze(width);
        drawGrid(ctx, width, height, globalState.userMaze);
    }





    // Actual game loop. Here we choose who gets animated.
    if (globalState.editorMode){
        drawEditorMode();
    } else {
        // Initial set up for the runningMaze.
        let myIterator = solveMaze(maze);
        let thisIteration;

        // Runs animation of solving.
        let runningMaze = function(){
            // Only generate next frame if we are animating!
            if (animationRunning){
                requestAnimationFrame(runningMaze);
            } else if (globalState.editorMode){
                requestAnimationFrame(drawEditorMode);
            }

            let thisIteration = myIterator.next();
            if ((!thisIteration.done || animationRunning) && !(thisIteration.value == undefined)) {
                // Magic maze solving goes on here.
                
                let correctSolution = thisIteration.value[0];
                let solution = thisIteration.value[1];
                if (correctSolution){
                    animationRunning = false;
                }
                if (animationRunning){
                    drawGrid(ctx, width, height, solution);
                } else {
                    // this is the last frame of the animation.
                    drawSolution(ctx, width, height);
                }
                
            } else {
                console.log("You blocked me in MATE!");
                animationRunning = false;
            }     
        }
        runningMaze();
    }
    
}

// This is where the user can update the maze.
function userUpdateMaze(sideLength){
    // We need to lock the mouse position into the different squares.
    let mouse = findIndex(sideLength);
    let xIndex = mouse[0];
    let yIndex = mouse[1];

    // Currently do not allow users to change starting positions.
    let tileMouseOver: string = globalState.userMaze[yIndex][xIndex];
    if (tileMouseOver == 'o' || tileMouseOver == 'X' || globalState.editState == 'o' || globalState.editState == 'X'){
        // GET OUT if over start or end.
        return undefined;
    } else {
        globalState.userMaze[yIndex][xIndex] = globalState.editState;
    }
}


// Detects if you click on a wall, empty space, start/end
// Enums would be awesome. Maybe in the future.
function setEditorState(sideLength): void{
    // We need to lock the mouse position into the different squares.
    let mouse = findIndex(sideLength);
    let xIndex = mouse[0];
    let yIndex = mouse[1];
    let clickedOn = globalState.userMaze[yIndex][xIndex];
    if (clickedOn == '#'){
        globalState.editState = '-';
    } else {
        globalState.editState = '#';
    }
    
}

// Normalises the mouse position into an index that we can use.
function findIndex(sideLength) :[number, number]{
    let squaresNumber: number = globalState.userMaze.length;
    let squareSideSize: number = sideLength / squaresNumber;
    let xIndex: number = Math.floor(globalState.mouseCood[0] / squareSideSize);
    let yIndex: number = Math.floor(globalState.mouseCood[1] / squareSideSize);
    return [xIndex, yIndex]
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
function solveMaze(myMaze:string){

    // Leave a trail of numbers that can increment with time!
    let recursiveSolver = function* (maze: string[][], currentPos: [number, number]){
        // Check base case
        
        let posRow = currentPos[0];
        let posCol = currentPos[1];
        if ((posRow < 0) || (posRow >= maze.length) || (posCol < 0) || (posCol >= maze.length)){
            // Do nothing again.
            console.log("Falling off map! EEEK!");
        } else {
            if (maze[posRow][posCol] == 'X'){
                maze[posRow][posCol] = '1';
                console.log("good job scotty.")
                yield [true, maze];
                yield [true, maze]; // Safety yield (because animation frames run 1 extra);
            } else if (maze[posRow][posCol] == '#'){
                console.log("THis is a wall SHIT!")
                // Do nothing usually.
                // return [false, maze];
            } else if ((maze[posRow][posCol] == '-') || (maze[posRow][posCol] == 'o')){
                // We can travel now.
                maze[posRow][posCol] = '1';
                yield [false, maze];
                // to go up [-1][0]
                // down [+1][0]
                // left [0][-1]
                // right [0][+1]
                
                globalState.actualSolution.push([posRow + 1, posCol]);
                yield* recursiveSolver(maze.slice(), [posRow + 1, posCol]);
                globalState.actualSolution.push([posRow - 1, posCol]);
                yield* recursiveSolver(maze.slice(), [posRow - 1, posCol]);
                globalState.actualSolution.push([posRow, posCol + 1]);
                yield* recursiveSolver(maze.slice(), [posRow, posCol + 1]);
                globalState.actualSolution.push([posRow, posCol - 1]);
                yield* recursiveSolver(maze.slice(), [posRow, posCol - 1]);
                
            } else {
                console.log("You're probably standing on a number. Get out of here.");
            }
        }
        let popped = globalState.actualSolution.pop(); // Throw out the garbage
    }

    // Find the start.
    let splitMaze = myMaze.split("\n");
    let startRow = splitMaze.findIndex((value)=> {
        return value.includes('o');
    });
    let startColumn = splitMaze[startRow].indexOf('o');

    let breakApartMap: string[][] = splitMaze.map((value)=>{
        return value.trim().split('');
    });

    return recursiveSolver(breakApartMap, [startRow, startColumn]);
}


// This is where the mouse magic happens.
function whileMouseDownOnCanvas(event): void {
    // This causes a different frame to be loaded.
    globalState.editorMode = true;
    gameLoop(cvs);
}

function mouseCaptureMove(event){
    event = event || window.event;
    
    var canvas = document.getElementById('mazeSolver-canvas'),
        x = event.pageX - canvas.offsetLeft,
        y = event.pageY - canvas.offsetTop;
    
    // Store it globally.
    globalState.mouseCood = [x, y];
}

function mouseDownOnCanvas (event){
    if(globalState.mouseDownInterval==null){    // Prevent multiple loops
     globalState.mouseDownInterval = setInterval(whileMouseDownOnCanvas.bind(window, event), 25);
    }
    globalState.editorMode = true;
    animationRunning = false;
    gameLoop(cvs);

}

function mouseUpOnCanvas (event){
    clearInterval(globalState.mouseDownInterval);
    globalState.mouseDownInterval = null;
    globalState.editState = "";
}

function runAnimation(){
    animationRunning = true;
    globalState.editorMode = false;
    gameLoop(cvs);
}