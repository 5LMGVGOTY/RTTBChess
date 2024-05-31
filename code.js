var board=[
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'], //Row 1, white pieces
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], 
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], //Row 8, black pieces
], objects=[
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null], 
    [null, null, null, null, null, null, null, null]
];
const IMAGES=new Map([
    ['K', "White_king"], 
    ['k', "Black_king"], 
    ['Q', "White_queen"], 
    ['q', "Black_queen"], 
    ['R', "White_rook"], 
    ['r', "Black_rook"], 
    ['N', "White_knight"], 
    ['n', "Black_knight"], 
    ['B', "White_bishop"], 
    ['b', "Black_bishop"], 
    ['P', "White_pawn"], 
    ['p', "Black_pawn"]
]);
const EMPTY=0, CAPTURE=1, BLOCKED=2, WHITE=1, BLACK=2;
var whatToShow=EMPTY;
const WHITE_BUTTON=document.getElementsByTagName("button")[0], BLACK_BUTTON=document.getElementsByTagName("button")[1];
function init() {
    console.log("Yay, HTML connects to this external JS file! ");
    for (let cell of document.getElementsByClassName("cell")) cell.addEventListener('click', () => selectCell(cell));
    WHITE_BUTTON.addEventListener('click', () => inputMove(true));
    BLACK_BUTTON.addEventListener('click', () => inputMove(false));
    for (let c=0; c<8; c++) for (let d=0; d<8; d++) {
        let cell=board[c][d];
        if (cell!=='0') {
            let type=IMAGES.get(cell);
            let image=document.createElement("img");
            image.src="Images/"+type+".png";
            image.setAttribute("alt", type);
            image.style.top=(7-c)*45+"px";
            image.style.left=d*45+"px";
            document.getElementById("board").appendChild(image);
            objects[c][d]=image;
        }
    }
}
var columnStartWhite, rowStartWhite, columnEndWhite, rowEndWhite, columnStartBlack, rowStartBlack, columnEndBlack, rowEndBlack;
function inputMove(isWhite) {
    whatToShow=(isWhite?WHITE:BLACK);
    WHITE_BUTTON.setAttribute("disabled", "disabled");
    BLACK_BUTTON.setAttribute("disabled", "disabled");
    if (isWhite) WHITE_BUTTON.innerText="Making white's move...";
    else BLACK_BUTTON.innerText="Making black's move...";
}
function resetCellColours() {
     for (let lightCell of document.getElementsByClassName("light")) lightCell.style.background="burlywood";
     for (let darkCell of document.getElementsByClassName("dark")) darkCell.style.background="saddlebrown";
}
function selectCell(cell) {
    let classes=cell.classList;
    let row= +classes[2].charAt(1), column= +classes[3].charAt(1);
    let piece=board[row][column];
    if (cell.style.background==="green") cell.style.background=classes.contains("light")?"burlywood":"saddlebrown";
    else if (cell.style.background==="yellow") {
        if (whatToShow===WHITE) {
            columnEndWhite=column;
            rowEndWhite=row;
            resetCellColours();
            WHITE_BUTTON.innerText="White's move made!";
            if (BLACK_BUTTON.innerHTML==="Black's move") BLACK_BUTTON.removeAttribute("disabled");
            else moveCheck();
        } else if (whatToShow===BLACK) {
            columnEndBlack=column;
            rowEndBlack=row;
            resetCellColours();
            BLACK_BUTTON.innerText="Black's move made!";
            if (WHITE_BUTTON.innerHTML==="White's move") WHITE_BUTTON.removeAttribute("disabled");
            else moveCheck();
        } else console.log("That wasn't supposed to happen :skull:");
        whatToShow=EMPTY;
    }
    else {
        switch(whatToShow) {
            case EMPTY:
                resetCellColours();
                cell.style.background="green";
                break;
            case WHITE:
                if (piece===piece.toUpperCase()) {
                    for (let moveOption of movementOptions(piece, row, column)) {
                        document.getElementsByClassName("r"+moveOption[0]+" c"+moveOption[1])[0].style.background="yellow";
                    }
                    columnStartWhite=column;
                    rowStartWhite=row;
                    cell.style.background="green";
                } else alert("This is a piece of your opponent's! ");
                break;
            case BLACK:
                if (piece===piece.toLowerCase()) {
                    for (let moveOption of movementOptions(piece, row, column)) {
                        document.getElementsByClassName("r"+moveOption[0]+" c"+moveOption[1])[0].style.background="yellow";
                    }
                    columnStartBlack=column;
                    rowStartBlack=row;
                    cell.style.background="green";
                } else alert("This is a piece of your opponent's! ");
                break;
        }
    }
}
function movementOptions(piece, row, column) {
    let cellsToMoveTo=[];
    switch(piece) {
        case 'K': case 'k'://Kings
            if (column<7&&row>0) cellsToMoveTo.push([row-1, column+1]);
            if (column<7) cellsToMoveTo.push([row, column+1]);
            if (column<7&&row<7) cellsToMoveTo.push([row+1, column+1]);
            if (row<7) cellsToMoveTo.push([row+1, column]);
            if (column>0&&row<7) cellsToMoveTo.push([row+1, column-1]);
            if (column>0) cellsToMoveTo.push([row, column-1]);
            if (column>0&&row>0) cellsToMoveTo.push([row-1, column-1]);
            if (row>0) cellsToMoveTo.push([row-1, column]);
            break;
        case 'Q': case 'q'://Queens
            cellsToMoveTo=cellsToMoveTo.concat(movementOptions(piece===piece.toUpperCase()?'R':'r', row, column), 
                                               movementOptions(piece===piece.toUpperCase()?'B':'b', row, column));
            break;
        case 'R': case 'r'://Rooks
            for (let c=row+1; c<=7; c++) {//up
                cellsToMoveTo.push([c, column]);
                if (interaction(piece, board[c][column])===BLOCKED) break;
            }
            for (let c=row-1; c>=0; c--) {//down
                cellsToMoveTo.push([c, column]);
                if (interaction(piece, board[c][column])===BLOCKED) break;
            }
            for (let c=column+1; c<=7; c++) {//right
                cellsToMoveTo.push([row, c]);
                if (interaction(piece, board[row][c])===BLOCKED) break;
            }
            for (let c=column-1; c>=0; c--) {//left
                cellsToMoveTo.push([row, c]);
                if (interaction(piece, board[row][c])===BLOCKED) break;
            }
            break;
        case 'N': case 'n'://Knights
            let moveOptions=[[row+1, column+2], [row+2, column+1], [row-1, column+2], [row-2, column+1], 
                             [row-1, column-2], [row-2, column-1], [row+1, column-2], [row+2, column-1]];
            for (let moveOption of moveOptions) {
                if (!(moveOption[0]<0||moveOption[0]>7||moveOption[1]<0||moveOption[1]>7)) cellsToMoveTo.push(moveOption);
            }
            break;
        case 'B': case 'b'://Bishops
            for (let c=1; c<8; c++) {//up right
                if (row+c>7 || column+c>7) break;
                else {
                    cellsToMoveTo.push([row+c, column+c]);
                    if (interaction(piece, board[row+c][column+c])===BLOCKED) break; 
                }
            }
            for (let c=1; c<8; c++) {//down right
                if (row-c<0 || column+c>7) break;
                else {
                    cellsToMoveTo.push([row-c, column+c]);
                    if (interaction(piece, board[row-c][column+c])===BLOCKED) break; 
                }
            }
            for (let c=1; c<8; c++) {//down left
                if (row-c<0 || column-c<0) break;
                else {
                    cellsToMoveTo.push([row-c, column-c]);
                    if (interaction(piece, board[row-c][column-c])===BLOCKED) break; 
                }
            }
            for (let c=1; c<8; c++) {//up left
                if (row+c>7 || column-c<0) break;
                else {
                    cellsToMoveTo.push([row+c, column-c]);
                    if (interaction(piece, board[row+c][column-c])===BLOCKED) break; 
                }
            }
            break;
        case 'P': case 'p'://Pawns
            let operation=((piece===piece.toUpperCase())?1:-1);
            if (interaction(piece, board[row+operation][column])!=BLOCKED) {
                cellsToMoveTo.push([row+operation, column]);
                if (row===((piece===piece.toUpperCase())?1:6)&&interaction(piece, board[operation*2+row][column])!=BLOCKED) {
                    cellsToMoveTo.push([operation*2+row, column]);
                }
            }
            if (column<7) cellsToMoveTo.push([row+operation, column+1]);
            if (column>0) cellsToMoveTo.push([row+operation, column-1]);
            break;
        case 0:default:break;
    }
    return cellsToMoveTo;
}
function interaction(piece, target) {
    if (target==='0') return EMPTY;
    else if ((piece===piece.toUpperCase()&&target===target.toLowerCase())||(piece===piece.toLowerCase()&&target===target.toUpperCase())) return CAPTURE;
    else return BLOCKED;
}
function moveCheck() {
    //gotta implement them all!
    move(true, true, true);
}
function move(whitePriority, legalWhite, legalBlack) {
    let imageWhite=objects[rowStartWhite][columnStartWhite], imageBlack=objects[rowStartBlack][columnStartBlack];
    let leftWhite=columnStartWhite*45, topWhite=(7-rowStartWhite)*45, columnDistanceWhite=columnEndWhite-columnStartWhite, rowDistanceWhite=rowEndWhite-rowStartWhite, 
        leftBlack=columnStartBlack*45, topBlack=(7-rowStartBlack)*45, columnDistanceBlack=columnEndBlack-columnStartBlack, rowDistanceBlack=rowEndBlack-rowStartBlack;
    let c=0, collision=false, idC=setInterval(function() {
        leftWhite+=columnDistanceWhite;
        imageWhite.style.left=leftWhite+"px";
        topWhite-=rowDistanceWhite;
        imageWhite.style.top=topWhite+"px";
        leftBlack+=columnDistanceBlack;
        imageBlack.style.left=leftBlack+"px";
        topBlack-=rowDistanceBlack;
        imageBlack.style.top=topBlack+"px";
        if (Math.abs(leftWhite-leftBlack)<5 && 
            Math.abs(topWhite-topBlack)<5 && 
            legalWhite && legalBlack) c=69;
        if (c>=44) {
            if (!legalWhite) {
                imageWhite.style.top=(7-rowStartWhite)*45+"px";
                let d=1; idD=setInterval(function() {
                    imageWhite.style.left=columnStartWhite*45+(d%4>=2?5:-5)+"px";
                    if (d>8) {
                        imageWhite.style.left=columnStartWhite*45+"px";
                        clearInterval(idD);
                    } else d++;
                }, 25);
            }
            if (!legalBlack) {
                imageBlack.style.top=(7-rowStartBlack)*45+"px";
                let d=1; idD=setInterval(function() {
                    imageBlack.style.left=columnStartBlack*45+(d%4>=2?5:-5)+"px";
                    if (d>8) {
                        imageBlack.style.left=columnStartBlack*45+"px";
                        clearInterval(idD);
                    } else d++;
                }, 25);
            }
            clearInterval(idC);
            doDangerousStuffWithTheData(c===69, whitePriority, legalWhite, legalBlack);
        } else c++;
    }, 30);
}
function doDangerousStuffWithTheData(collision, whitePriority, legalWhite, legalBlack) {
    if (collision) {
        console.log("There was a collision");
        board[rowStartWhite][columnStartWhite]='0';
        board[rowStartBlack][columnStartBlack]='0';
        document.getElementById("board").removeChild(objects[rowStartWhite][columnStartWhite]);
        document.getElementById("board").removeChild(objects[rowStartBlack][columnStartBlack]);
        objects[rowStartWhite][columnStartWhite]=null;
        objects[rowStartBlack][columnStartBlack]=null;
    } else {
        if (whitePriority) {
            if (objects[rowEndWhite][columnEndWhite]!==null) document.getElementById("board").removeChild(objects[rowEndWhite][columnEndWhite]);
            board[rowEndWhite][columnEndWhite]=board[rowStartWhite][columnStartWhite];
            board[rowStartWhite][columnStartWhite]='0';
            objects[rowEndWhite][columnEndWhite]=objects[rowStartWhite][columnStartWhite];
            objects[rowStartWhite][columnStartWhite]=null;
        }
        if (objects[rowEndBlack][columnEndBlack]!==null) document.getElementById("board").removeChild(objects[rowEndBlack][columnEndBlack]);
        board[rowEndBlack][columnEndBlack]=board[rowStartBlack][columnStartBlack];
        board[rowStartBlack][columnStartBlack]='0';
        objects[rowEndBlack][columnEndBlack]=objects[rowStartBlack][columnStartBlack];
        objects[rowStartBlack][columnStartBlack]=null;
        if (!whitePriority) {
            if (objects[rowEndWhite][columnEndWhite]!==null) document.getElementById("board").removeChild(objects[rowEndWhite][columnEndWhite]);
            board[rowEndWhite][columnEndWhite]=board[rowStartWhite][columnStartWhite];
            board[rowStartWhite][columnStartWhite]='0';
            objects[rowEndWhite][columnEndWhite]=objects[rowStartWhite][columnStartWhite];
            objects[rowStartWhite][columnStartWhite]=null;
        }
    }
    document.getElementById("whiteMoveButton").innerText="White's move";
    document.getElementById("whiteMoveButton").removeAttribute("disabled");
    document.getElementById("blackMoveButton").innerText="Black's move";
    document.getElementById("blackMoveButton").removeAttribute("disabled");
}