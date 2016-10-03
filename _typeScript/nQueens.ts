(function (){
    function drawGrid(ctx:CanvasRenderingContext2D, width:number, height:number, cells: number):void{
        let squareWidth: number = width / cells;
        for (let i = 0; i < cells; i ++){
            for (let j = 0; j < cells; j ++){
                if ((j + i) % 2 == 0){
                    ctx.fillStyle = "#C6C6C6";
                } else {
                    ctx.fillStyle = "#E8E8E8";
                }
                ctx.fillRect(i*squareWidth, j*squareWidth, squareWidth, squareWidth);
            }
            
        }
    }

    // creates a canvas and appends it to the page
    function createCanvas(width: number, height: number, divId: string): CanvasRenderingContext2D {
        let stage = document.getElementById(divId);

        let oldcanv = document.getElementById("nQueens-canvas")
        stage.removeChild(oldcanv)

        var canv = <HTMLCanvasElement>document.createElement("canvas");
        canv.id = "nQueens-canvas";
        canv.height = height;
        canv.width = width;
        
        stage.appendChild(canv);

        let context = canv.getContext('2d');
        drawGrid(context, width, height, 5);
        return context
    }



    // Function takes in the width of the board.
    function nQueens(){
        let solutions: string[] = [];
        
        var checkBoard = function(board: string, boardSize: number): boolean{
            // Only check the last queen against previous ones.
            let boardLen: number = board.length;
            if (boardSize == 1){
                return true;
            }
            let lastQueen: number = Number(board[boardLen - 1]);
            for (let distance = 1; distance < boardLen; distance ++){
                if ((Math.abs(lastQueen - Number(board[boardLen - 1 - distance])) == distance) ||
                    lastQueen == Number(board[boardLen - 1 - distance])){
                    return false
                }
            }
            return true;
        };
        
        let solver = function* (col: string, boardWidth: number): IterableIterator<[boolean, string]>{
            //let solution: any = '';
            if (col.length > 1 && !checkBoard(col, boardWidth)){
                // Do nothing at all
                yield [false, col];
            } else if (col.length == boardWidth){
                yield [true, col]; // Returning solution and finishing generator
            } else {
                // Spawn more
                for (let i = 0; i < boardWidth; i ++){
                    yield [false, col + i.toString()];
                    yield* solver(col + i.toString(), boardWidth);
                }
            }

        }
        return solver;
    }

    function drawQueens(context: CanvasRenderingContext2D, currentSol:string, size: number){
        var drawCircle = function(centerX, centerY){
            context.beginPath();
            context.arc(centerX, centerY, size/2.2, 0, 2 * Math.PI, false);
            context.fillStyle = '#8594A8';
            context.fill();
            context.closePath();
        };
        let offset = size / 2;
        for (let i = 0; i < currentSol.length; i++){
            let pos = Number(currentSol[i]);
            drawCircle(i * size + offset, pos * size + offset);
        }
        
    }


    function initGameLoop(ctx: CanvasRenderingContext2D, side, n, animationNumber: number){
        let nQueenGen = nQueens(); //Need to call the generator once.
        let myIterator = nQueenGen("", n);

        let isDone: boolean = false;
        let currentIteration: string = "";
        let thisIteration: IteratorResult<[boolean, string]>;
        let storedSolution: string;

        // This is the meat of the program.
        let gameLoop = function(){
            if (!isDone && globalNumber == animationNumber){
                // Only play another animation if NOT done.
                requestAnimationFrame(gameLoop);
            }
            // Clear board
            ctx.clearRect(0, 0, side, side);
            // Draw board
            drawGrid(ctx, side, side, n);

            // Iterate by 1 step.
            thisIteration = myIterator.next();

            if (!thisIteration.done){
                let correctSolution: boolean= thisIteration.value[0];
                let solution: string = thisIteration.value[1];

                if (!isDone){
                    // // Place pieces on board.
                    drawQueens(ctx, solution, side/n);
                } else {
                    drawQueens(ctx, storedSolution, side/n);
                }
                
                if (correctSolution) {
                    isDone = true;
                    storedSolution = solution;
                }
            }

        }
        gameLoop(); // Initiates the loop
    }




    // Very rough.
    function reset(){
        let side = 400;
        let ctx = createCanvas(side, side, "canvas-nqueens");
        let nInput = <HTMLInputElement>document.getElementById("nQueens-n");
        let n = parseInt(nInput.value);
        if (n < 4 || !n){
            n = 4;
        } else if (n > 10){
            n = 10;
        }
        globalNumber ++;
        initGameLoop(ctx, side, n, globalNumber);
    }

    // Global vars
    let globalNumber = 0;

    // Event Handlers
    let submitButton = document.getElementById("btn-submit");
    submitButton.addEventListener("click", ()=> {
        reset();
    });

    // Just run this once to get a nice board.
    (() => {
        let side = 400;
        let ctx = createCanvas(side, side, "canvas-nqueens");
    })();
})();
