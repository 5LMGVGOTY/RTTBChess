var board=[//The data of where the pieces are
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'], //Row 1, light pieces
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['0', '0', '0', '0', '0', '0', '0', '0'], 
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], 
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], //Row 8, dark pieces
], objects=[//The img tags displayed on the board
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
    ['K', "Light_king"], 
    ['k', "Dark_king"], 
    ['Q', "Light_queen"], 
    ['q', "Dark_queen"], 
    ['R', "Light_rook"], 
    ['r', "Dark_rook"], 
    ['N', "Light_knight"], 
    ['n', "Dark_knight"], 
    ['B', "Light_bishop"], 
    ['b', "Dark_bishop"], 
    ['P', "Light_pawn"], 
    ['p', "Dark_pawn"]
]);
var keypresses=["", "", "", "", "", "", "", "", "", ""];//do not think about this too much
const EMPTY=0, CAPTURE=1, BLOCKED=2, LIGHT=1, DARK=2;
var whatToShow=EMPTY, shortCastleLight=true, longCastleLight=true, shortCastleDark=true, longCastleDark=true;
const LIGHT_BUTTON=document.getElementsByTagName("button")[0], DARK_BUTTON=document.getElementsByTagName("button")[1];
function init() {
    document.onkeydown=function(event) {//do not think about this too much
        keypresses.push(event.key);
        keypresses.shift();
        if (keypresses[0]==="ArrowUp"&&keypresses[1]==="ArrowUp"&&keypresses[2]==="ArrowDown"&&keypresses[3]==="ArrowDown"&&keypresses[4]==="ArrowLeft"&&
            keypresses[5]==="ArrowRight"&&keypresses[6]==="ArrowLeft"&&keypresses[7]==="ArrowRight"&&keypresses[8]==="b"&&keypresses[9]==="a") {
            document.body.style.backgroundImage="url('Images/SecretBackground.webp')";
            console.log("30 more lives for you! ");
            document.onkeydown=null;
        }
    };
    for (let cell of document.getElementsByClassName("cell")) cell.addEventListener('click', () => selectCell(cell));
    LIGHT_BUTTON.addEventListener('click', () => inputMove(true));
    DARK_BUTTON.addEventListener('click', () => inputMove(false));
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
var columnStartLight, rowStartLight, columnEndLight, rowEndLight, columnStartDark, rowStartDark, columnEndDark, rowEndDark;
function inputMove(isLight) {//What happens when you press a button
    whatToShow=(isLight?LIGHT:DARK);
    LIGHT_BUTTON.setAttribute("disabled", "disabled");
    DARK_BUTTON.setAttribute("disabled", "disabled");
    if (isLight) LIGHT_BUTTON.innerText="Making light's move...";
    else DARK_BUTTON.innerText="Making dark's move...";
}
function resetCellAnims() {
     for (let cell of document.getElementsByClassName("cell")) cell.style.animationName="none";
}
function selectCell(cell) {//What happens when you click on a cell
    let classes=cell.classList;
    let row= +classes[2].charAt(1), column= +classes[3].charAt(1);
    let piece=board[row][column];
    let cellAnim=cell.style.animationName;
    resetCellAnims();
    if (cellAnim==="cellAnimYellow"||cellAnim==="cellAnimRed") {
        resetCellAnims();
        if (whatToShow===LIGHT) {
            columnEndLight=column;
            rowEndLight=row;
            resetCellAnims();
            LIGHT_BUTTON.innerText="Light's move made!";
            if (DARK_BUTTON.innerHTML==="Dark's move") DARK_BUTTON.removeAttribute("disabled");
            else moveCheck();
        } else if (whatToShow===DARK) {
            columnEndDark=column;
            rowEndDark=row;
            resetCellAnims();
            DARK_BUTTON.innerText="Dark's move made!";
            if (LIGHT_BUTTON.innerHTML==="Light's move") LIGHT_BUTTON.removeAttribute("disabled");
            else moveCheck();
        } else console.warn("That wasn't supposed to happen :skull:");
        whatToShow=EMPTY;
    }
    else if (cellAnim!=="cellAnimGreen") {
        switch(whatToShow) {
            case EMPTY:
                cell.style.animationName="cellAnimGreen";
                break;
            case LIGHT:
                if (piece===piece.toUpperCase()) {
                    for (let moveOption of movementOptions(piece, row, column)) {
                        document.getElementsByClassName("r"+moveOption[0]+" c"+moveOption[1])[0].style.animationName=board[moveOption[0]][moveOption[1]]==='0'?"cellAnimYellow":"cellAnimRed";
                    }
                    columnStartLight=column;
                    rowStartLight=row;
                    cell.style.animationName="cellAnimGreen";
                } else alert("This is a piece of your opponent's! ");
                break;
            case DARK:
                if (piece===piece.toLowerCase()) {
                    for (let moveOption of movementOptions(piece, row, column)) {
                        document.getElementsByClassName("r"+moveOption[0]+" c"+moveOption[1])[0].style.animationName="cellAnimYellow";
                    }
                    columnStartDark=column;
                    rowStartDark=row;
                    cell.style.animationName="cellAnimGreen";
                } else alert("This is a piece of your opponent's! ");
                break;
        }
    }
}
function movementOptions(piece, row, column) {//What cells pieces can move to
    let cellsToMoveTo=[];
    switch(piece) {
        case 'K': case 'k'://Kings
            //add check & castling movement rules
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
function interaction(piece, target) {//What would happen if piece would land on target
    if (target==='0') return EMPTY;
    else if ((piece===piece.toUpperCase()&&target===target.toLowerCase())||(piece===piece.toLowerCase()&&target===target.toUpperCase())) return CAPTURE;
    else return BLOCKED;
}
function moveCheck() {//Uses advanced logic and processing to determine the outcome of two simultaneous moves
    //gotta implement them all!
    move(true, true, true);
}
function move(lightPriority, legalLight, legalDark) {//Actually moves the pieces AND checks for collisions
    let imageLight=objects[rowStartLight][columnStartLight], imageDark=objects[rowStartDark][columnStartDark];
    let leftLight=columnStartLight*45, topLight=(7-rowStartLight)*45, columnDistanceLight=columnEndLight-columnStartLight, rowDistanceLight=rowEndLight-rowStartLight, 
        leftDark=columnStartDark*45, topDark=(7-rowStartDark)*45, columnDistanceDark=columnEndDark-columnStartDark, rowDistanceDark=rowEndDark-rowStartDark;
    let c=0, collision=false, idC=setInterval(function() {
        leftLight+=columnDistanceLight;
        imageLight.style.left=leftLight+"px";
        topLight-=rowDistanceLight;
        imageLight.style.top=topLight+"px";
        leftDark+=columnDistanceDark;
        imageDark.style.left=leftDark+"px";
        topDark-=rowDistanceDark;
        imageDark.style.top=topDark+"px";
        if (Math.abs(leftLight-leftDark)<5 && 
            Math.abs(topLight-topDark)<5 && 
            legalLight && legalDark) c=69;
        if (c>=44) {
            if (!legalLight) {
                imageLight.style.top=(7-rowStartLight)*45+"px";
                let d=1; idD=setInterval(function() {
                    imageLight.style.left=columnStartLight*45+(d%4>=2?5:-5)+"px";
                    if (d>8) {
                        imageLight.style.left=columnStartLight*45+"px";
                        clearInterval(idD);
                    } else d++;
                }, 25);
            }
            if (!legalDark) {
                imageDark.style.top=(7-rowStartDark)*45+"px";
                let d=1; idD=setInterval(function() {
                    imageDark.style.left=columnStartDark*45+(d%4>=2?5:-5)+"px";
                    if (d>8) {
                        imageDark.style.left=columnStartDark*45+"px";
                        clearInterval(idD);
                    } else d++;
                }, 25);
            }
            clearInterval(idC);
            doDangerousStuffWithTheData(c===69, lightPriority, legalLight, legalDark);
        } else c++;
    }, 30);
}
function doDangerousStuffWithTheData(collision, lightPriority, legalLight, legalDark) {//Changes the board and objects variables according to the moves' outcome
    if (collision) {
        board[rowStartLight][columnStartLight]='0';
        board[rowStartDark][columnStartDark]='0';
        document.getElementById("board").removeChild(objects[rowStartLight][columnStartLight]);
        document.getElementById("board").removeChild(objects[rowStartDark][columnStartDark]);
        objects[rowStartLight][columnStartLight]=null;
        objects[rowStartDark][columnStartDark]=null;
    } else {
        if (lightPriority && legalLight) {
            if (interaction('K', board[rowStartLight][columnStartLight])===BLOCKED && rowStartLight===0) {
                if (columnStartLight===0 || columnStartLight===4) longCastleLight=false;
                if (columnStartLight===4 || columnStartLight===7) shortCastleLight=false;
            }
            if (objects[rowEndLight][columnEndLight]!==null) document.getElementById("board").removeChild(objects[rowEndLight][columnEndLight]);
            board[rowEndLight][columnEndLight]=board[rowStartLight][columnStartLight];
            board[rowStartLight][columnStartLight]='0';
            objects[rowEndLight][columnEndLight]=objects[rowStartLight][columnStartLight];
            objects[rowStartLight][columnStartLight]=null;
        }
        if (legalDark) {
            if (interaction('K', board[rowStartDark][columnStartDark])===BLOCKED && rowStartDark===0) {
                if (columnStartDark===0 || columnStartDark===4) longCastleDark=false;
                if (columnStartDark===4 || columnStartDark===7) shortCastleDark=false;
            }
            if (objects[rowEndDark][columnEndDark]!==null) document.getElementById("board").removeChild(objects[rowEndDark][columnEndDark]);
            board[rowEndDark][columnEndDark]=board[rowStartDark][columnStartDark];
            board[rowStartDark][columnStartDark]='0';
            objects[rowEndDark][columnEndDark]=objects[rowStartDark][columnStartDark];
            objects[rowStartDark][columnStartDark]=null;
        }
        if (!lightPriority && legalLight) {
            if (interaction('K', board[rowStartLight][columnStartLight])===BLOCKED && rowStartLight===0) {
                if (columnStartLight===0 || columnStartLight===4) longCastleLight=false;
                if (columnStartLight===4 || columnStartLight===7) shortCastleLight=false;
            }
            if (objects[rowEndLight][columnEndLight]!==null) document.getElementById("board").removeChild(objects[rowEndLight][columnEndLight]);
            board[rowEndLight][columnEndLight]=board[rowStartLight][columnStartLight];
            board[rowStartLight][columnStartLight]='0';
            objects[rowEndLight][columnEndLight]=objects[rowStartLight][columnStartLight];
            objects[rowStartLight][columnStartLight]=null;
        }
    }
    document.getElementById("lightMoveButton").innerText="Light's move";
    document.getElementById("lightMoveButton").removeAttribute("disabled");
    document.getElementById("darkMoveButton").innerText="Dark's move";
    document.getElementById("darkMoveButton").removeAttribute("disabled");
}