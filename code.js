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
const EMPTY=0, CAPTURE=1, BLOCKED=2, LIGHT=0, DRAW=1, DARK=2, BUTTONS=document.getElementsByTagName("button");
var whatToShow=DRAW, castles=[true, true, true, true], moveLight=[0, 0, 0, 0], moveDark=[0, 0, 0, 0], checkLight=false, checkDark=false;
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
    BUTTONS[LIGHT].addEventListener('click', () => inputMove(true));
    BUTTONS[DRAW].addEventListener('click', () => moveCheck());
    BUTTONS[DARK].addEventListener('click', () => inputMove(false));
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
function inputMove(isLight) {//What happens when you press a button
    whatToShow=(isLight?LIGHT:DARK);
    BUTTONS[LIGHT].setAttribute("disabled", "disabled");
    BUTTONS[DARK].setAttribute("disabled", "disabled");
    if (isLight) BUTTONS[LIGHT].innerText="Making light's move...";
    else BUTTONS[DARK].innerText="Making dark's move...";
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
            moveLight[2]=column;
            moveLight[3]=row;
            resetCellAnims();
            BUTTONS[LIGHT].innerText="Light's move made!";
            if (BUTTONS[DARK].innerHTML==="Dark's move") BUTTONS[DARK].removeAttribute("disabled");
            else BUTTONS[DRAW].removeAttribute("disabled");
        } else if (whatToShow===DARK) {
            moveDark[2]=column;
            moveDark[3]=row;
            resetCellAnims();
            BUTTONS[DARK].innerText="Dark's move made!";
            if (BUTTONS[LIGHT].innerHTML==="Light's move") BUTTONS[LIGHT].removeAttribute("disabled");
            else BUTTONS[DRAW].removeAttribute("disabled");
        } else console.warn("That wasn't supposed to happen :skull:");
        whatToShow=DRAW;
    }
    else if (cellAnim==="none") {
        switch(whatToShow) {
            case DRAW:
                cell.style.animationName="cellAnimGreen";
                break;
            case LIGHT:
                if (piece===piece.toUpperCase()) {
                    for (let moveOption of movementOptions(piece, row, column, false)) {
                        document.getElementsByClassName("r"+moveOption[0]+" c"+moveOption[1])[0].style.animationName=board[moveOption[0]][moveOption[1]]==='0'?"cellAnimYellow":"cellAnimRed";
                    }
                    moveLight[0]=column;
                    moveLight[1]=row;
                    cell.style.animationName="cellAnimGreen";
                } else alert("This is a piece of your opponent's! ");
                break;
            case DARK:
                if (piece===piece.toLowerCase()) {
                    for (let moveOption of movementOptions(piece, row, column, false)) {
                        document.getElementsByClassName("r"+moveOption[0]+" c"+moveOption[1])[0].style.animationName=board[moveOption[0]][moveOption[1]]==='0'?"cellAnimYellow":"cellAnimRed";
                    }
                    moveDark[0]=column;
                    moveDark[1]=row;
                    cell.style.animationName="cellAnimGreen";
                } else alert("This is a piece of your opponent's! ");
                break;
        }
    }
}
function movementOptions(piece, row, column, checkForChecks) {//What cells pieces can move to
    let cellsToMoveTo=[];
    switch(piece) {
        case 'K'://Kings
            if (!checkForChecks) {
                if (row<7) {
                    if (column<7) cellsToMoveTo.push([row+1, column+1]);
                    cellsToMoveTo.push([row+1, column]);
                    if (column>0) cellsToMoveTo.push([row+1, column-1]);
                }
                if (row>0) {
                    if (column<7) cellsToMoveTo.push([row-1, column+1]);
                    cellsToMoveTo.push([row-1, column]);
                    if (column>0) cellsToMoveTo.push([row-1, column-1]);
                }
                if (column<7) cellsToMoveTo.push([row, column+1]);
                if (column>0) cellsToMoveTo.push([row, column-1]);
            }
            break;
        case 'Q'://Light queen
            cellsToMoveTo=cellsToMoveTo.concat(movementOptions('R', row, column), movementOptions('B', row, column));
            break;
        case 'q'://Dark queen
            cellsToMoveTo=cellsToMoveTo.concat(movementOptions('r', row, column), movementOptions('b', row, column));
            break;
        case 'R': case 'r'://Rooks
            let piercing=false;
            for (let c=row+1; c<=7; c++) {//up
                let inter=interaction(piece, board[c][column]);
                cellsToMoveTo.push([c, column]);
                if (inter===BLOCKED) break;
                else if (inter===CAPTURE) {
                    if (piercing) break;
                    else piercing=true;
                }
            }
            piercing=false;
            for (let c=row-1; c>=0; c--) {//down
                let inter=interaction(piece, board[c][column]);
                cellsToMoveTo.push([c, column]);
                if (inter===BLOCKED) break;
                else if (inter===CAPTURE) {
                    if (piercing) break;
                    else piercing=true;
                }
            }
            piercing=false;
            for (let c=column+1; c<=7; c++) {//right
                let inter=interaction(piece, board[row][c]);
                cellsToMoveTo.push([row, c]);
                if (inter===BLOCKED) break;
                else if (inter===CAPTURE) {
                    if (piercing) break;
                    else piercing=true;
                }
            }
            piercing=false;
            for (let c=column-1; c>=0; c--) {//left
                let inter=interaction(piece, board[row][c]);
                cellsToMoveTo.push([row, c]);
                if (inter===BLOCKED) break;
                else if (inter===CAPTURE) {
                    if (piercing) break;
                    else piercing=true;
                }
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
            let piercingButForBishops=false;
            for (let c=1; c<8; c++) {//up right
                if (row+c>7 || column+c>7) break;
                else {
                    let inter=interaction(piece, board[row+c][column+c]);
                    cellsToMoveTo.push([row+c, column+c]);
                    if (inter===BLOCKED) break;
                    else if (inter===CAPTURE) {
                        if (piercingButForBishops) break;
                        else piercingButForBishops=true;
                    }
                }
            }
            piercingButForBishops=false;
            for (let c=1; c<8; c++) {//down right
                if (row-c<0 || column+c>7) break;
                else {
                    let inter=interaction(piece, board[row-c][column+c]);
                    cellsToMoveTo.push([row-c, column+c]);
                    if (inter===BLOCKED) break;
                    else if (inter===CAPTURE) {
                        if (piercingButForBishops) break;
                        else piercingButForBishops=true;
                    }
                }
            }
            piercingButForBishops=false;
            for (let c=1; c<8; c++) {//down left
                if (row-c<0 || column-c<0) break;
                else {
                    let inter=interaction(piece, board[row-c][column-c]);
                    cellsToMoveTo.push([row-c, column-c]);
                    if (inter===BLOCKED) break;
                    else if (inter===CAPTURE) {
                        if (piercingButForBishops) break;
                        else piercingButForBishops=true;
                    }
                }
            }
            piercingButForBishops=false;
            for (let c=1; c<8; c++) {//up left
                if (row+c>7 || column-c<0) break;
                else {
                    let inter=interaction(piece, board[row+c][column-c]);
                    cellsToMoveTo.push([row+c, column-c]);
                    if (inter===BLOCKED) break;
                    else if (inter===CAPTURE) {
                        if (piercingButForBishops) break;
                        else piercingButForBishops=true;
                    }
                }
            }
            break;
        case 'P'://Light pawn
            if (interaction(piece, board[row+1][column])!==BLOCKED && !checkForChecks) {
                cellsToMoveTo.push([row+1, column]);
                if (row===1&&interaction(piece, board[row+2][column])!==BLOCKED) {
                    cellsToMoveTo.push([row+2, column]);
                }
            }
            if (column<7) cellsToMoveTo.push([row+1, column+1]);
            if (column>0) cellsToMoveTo.push([row+1, column-1]);
            break;
        case 'p'://Dark pawn
            if (interaction(piece, board[row-1][column])!==BLOCKED && !checkForChecks) {
                cellsToMoveTo.push([row-1, column]);
                if (row===6&&interaction(piece, board[row-2][column])!==BLOCKED) {
                    cellsToMoveTo.push([row-2, column]);
                }
            }
            if (column<7) cellsToMoveTo.push([row-1, column+1]);
            if (column>0) cellsToMoveTo.push([row-1, column-1]);
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
    BUTTONS[DRAW].setAttribute("disabled", "disabled");
    BUTTONS[DRAW].innerHTML="Resolving moves...";
    let lightPriority=true, legalLight=true, legalDark=true;
    if (interaction('K', board[moveLight[3]][moveLight[2]])===BLOCKED) {
        if (moveDark[3]===moveLight[3] && moveDark[2]===moveLight[2]) lightPriority=false;
        else legalLight=false;
    }
    if (interaction('k', board[moveDark[3]][moveDark[2]])===BLOCKED) {
        if (moveDark[3]===moveLight[3] && moveDark[2]===moveLight[2]) lightPriority=true;
        else legalDark=false;
    }
    //TODO gotta implement them all!
    move(lightPriority, legalLight, legalDark);
    BUTTONS[LIGHT].innerText="Light's move";
    BUTTONS[LIGHT].removeAttribute("disabled");
    BUTTONS[DARK].innerText="Dark's move";
    BUTTONS[DARK].removeAttribute("disabled");
    BUTTONS[DRAW].innerHTML="Resolve moves";
}
function move(lightPriority, legalLight, legalDark) {//Actually moves the pieces AND checks for collisions
    let imageLight=objects[moveLight[1]][moveLight[0]], imageDark=objects[moveDark[1]][moveDark[0]];
    let leftLight=moveLight[0]*45, topLight=(7-moveLight[1])*45, columnDistanceLight=moveLight[2]-moveLight[0], rowDistanceLight=moveLight[3]-moveLight[1], 
        leftDark=moveDark[0]*45, topDark=(7-moveDark[1])*45, columnDistanceDark=moveDark[2]-moveDark[0], rowDistanceDark=moveDark[3]-moveDark[1];
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
                imageLight.style.top=(7-moveLight[1])*45+"px";
                let d=1; idD=setInterval(function() {
                    imageLight.style.left=moveLight[0]*45+(d%4>=2?5:-5)+"px";
                    if (d>8) {
                        imageLight.style.left=moveLight[0]*45+"px";
                        clearInterval(idD);
                    } else d++;
                }, 25);
            }
            if (!legalDark) {
                imageDark.style.top=(7-moveDark[1])*45+"px";
                let d=1; idD=setInterval(function() {
                    imageDark.style.left=moveDark[0]*45+(d%4>=2?5:-5)+"px";
                    if (d>8) {
                        imageDark.style.left=moveDark[0]*45+"px";
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
        board[moveLight[1]][moveLight[0]]='0';
        board[moveDark[1]][moveDark[0]]='0';
        document.getElementById("board").removeChild(objects[moveLight[1]][moveLight[0]]);
        document.getElementById("board").removeChild(objects[moveDark[1]][moveDark[0]]);
        objects[moveLight[1]][moveLight[0]]=null;
        objects[moveDark[1]][moveDark[0]]=null;
    } else {
        if (lightPriority && legalLight) {
            if (interaction('K', board[moveLight[1]][moveLight[0]])===BLOCKED && moveLight[1]===0) {
                if (moveLight[0]===0 || moveLight[0]===4) longCastleLight=false;
                if (moveLight[0]===4 || moveLight[0]===7) shortCastleLight=false;
            }
            if (objects[moveLight[3]][moveLight[2]]!==null) document.getElementById("board").removeChild(objects[moveLight[3]][moveLight[2]]);
            board[moveLight[3]][moveLight[2]]=board[moveLight[1]][moveLight[0]];
            board[moveLight[1]][moveLight[0]]='0';
            objects[moveLight[3]][moveLight[2]]=objects[moveLight[1]][moveLight[0]];
            objects[moveLight[1]][moveLight[0]]=null;
        }
        if (legalDark) {
            if (interaction('K', board[moveDark[1]][moveDark[0]])===BLOCKED && moveDark[1]===0) {
                if (moveDark[0]===0 || moveDark[0]===4) longCastleDark=false;
                if (moveDark[0]===4 || moveDark[0]===7) shortCastleDark=false;
            }
            if (objects[moveDark[3]][moveDark[2]]!==null) document.getElementById("board").removeChild(objects[moveDark[3]][moveDark[2]]);
            board[moveDark[3]][moveDark[2]]=board[moveDark[1]][moveDark[0]];
            board[moveDark[1]][moveDark[0]]='0';
            objects[moveDark[3]][moveDark[2]]=objects[moveDark[1]][moveDark[0]];
            objects[moveDark[1]][moveDark[0]]=null;
        }
        if (!lightPriority && legalLight) {
            if (interaction('K', board[moveLight[1]][moveLight[0]])===BLOCKED && moveLight[1]===0) {
                if (moveLight[0]===0 || moveLight[0]===4) longCastleLight=false;
                if (moveLight[0]===4 || moveLight[0]===7) shortCastleLight=false;
            }
            if (objects[moveLight[3]][moveLight[2]]!==null) document.getElementById("board").removeChild(objects[moveLight[3]][moveLight[2]]);
            board[moveLight[3]][moveLight[2]]=board[moveLight[1]][moveLight[0]];
            board[moveLight[1]][moveLight[0]]='0';
            objects[moveLight[3]][moveLight[2]]=objects[moveLight[1]][moveLight[0]];
            objects[moveLight[1]][moveLight[0]]=null;
        }
    }
}