var board=[
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-'], 
    ['-', 'R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R', '-'], //Row 1, white pieces
    ['-', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', '-'], 
    ['-', '0', '0', '0', '0', '0', '0', '0', '0', '-'], 
    ['-', '0', '0', '0', '0', '0', '0', '0', '0', '-'], 
    ['-', '0', '0', '0', '0', '0', '0', '0', '0', '-'], 
    ['-', '0', '0', '0', '0', '0', '0', '0', '0', '-'], 
    ['-', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', '-'], 
    ['-', 'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r', '-'], //Row 8, black pieces
    ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-']
];
const EMPTY=0, CAPTURE=1, BLOCKED=2, OUTSIDE=3;
function testConnection() {
    console.log("Yay, HTML connects to this external JS file! ");
    for (let cell of document.getElementsByClassName("cell")) cell.addEventListener('click', () => selectCell(cell));
}
function selectCell(cell) {
    let classes=cell.classList;
    let row= +classes[2].charAt(1), column= +classes[3].charAt(1);
    let piece=board[row][column];
    let desc="";
    switch(piece) {
        case 'K': case 'k': desc="a king"; break;
        case 'Q': case 'q': desc="a queen"; break;
        case 'R': case 'r': desc="a rook"; break;
        case 'N': case 'n': desc="a knight"; break;
        case 'B': case 'b': desc="a bishop"; break;
        case 'P': case 'p': desc="a pawn"; break;
        case '0': default: desc="nothing"; break;
    }
    console.log("Clicked cell at "+toCellNotation(row, column)+", there is "+desc+". ");
    if (cell.style.background==="yellow") {
        move();
        for (let div of document.getElementsByClassName("cell")) {
            div.style.background=div.classList.contains("light")?"burlywood":"saddlebrown";
        }
    } else {
        for (let div of document.getElementsByClassName("cell")) {
            div.style.background=div.classList.contains("light")?"burlywood":"saddlebrown";
        }
        for (let moveOption of movementOptions(piece, row, column)) {
            for (let element of document.getElementsByClassName("r"+(moveOption[0]))) {
                if (element.classList.contains("c"+(moveOption[1]))) {
                    element.style.background="yellow";
                }
            }
        }
    }
    cell.style.background="green";
}
function movementOptions(piece, row, column) {
    let cellsToMoveTo=[];
    switch(piece) {
        case 'K': case 'k'://Kings
            if (column<8&&row>1) cellsToMoveTo.push([row-1, column+1]);
            if (column<8) cellsToMoveTo.push([row, column+1]);
            if (column<8&&row<8) cellsToMoveTo.push([row+1, column+1]);
            if (row<8) cellsToMoveTo.push([row+1, column]);
            if (column>1&&row<7) cellsToMoveTo.push([row+1, column-1]);
            if (column>1) cellsToMoveTo.push([row, column-1]);
            if (column>1&&row>1) cellsToMoveTo.push([row-1, column-1]);
            if (row>1) cellsToMoveTo.push([row-1, column]);
            break;
        case 'Q': case 'q'://Queens
            cellsToMoveTo=cellsToMoveTo.concat(movementOptions(piece===piece.toUpperCase()?'R':'r', row, column), 
                                               movementOptions(piece===piece.toUpperCase()?'B':'b', row, column));
            break;
        case 'R': case 'r'://Rooks
            for (let c=row+1; c<=8; c++) {//up
                cellsToMoveTo.push([c, column]);
                if (interaction(piece, c, column)===BLOCKED) break;
            }
            for (let c=row-1; c>=1; c++) {//down
                cellsToMoveTo.push([c, column]);
                if (interaction(piece, c, column)===BLOCKED) break;
            }
            for (let c=column+1; c<=8; c++) {//right
                cellsToMoveTo.push([row, c]);
                if (interaction(piece, row, c)===BLOCKED) break;
            }
            for (let c=column-1; c>=1; c++) {//left
                cellsToMoveTo.push([row, c]);
                if (interaction(piece, row, c)===BLOCKED) break;
            }
            break;
        case 'N': case 'n'://Knights
            let moveOptions=[[row+1, column+2], [row+2, column+1], [row-1, column+2], [row-2, column+1], 
                             [row-1, column-2], [row-2, column-1], [row+1, column-2], [row+2, column-1]];
            for (let moveOption of moveOptions) {
                if (moveOption[0]<1||moveOption[0]>8||moveOption[1]<1||moveOption[1]>8) continue;
                else cellsToMoveTo.push([moveOption[0], moveOption[1]]);
            }
            break;
        case 'B': case 'b'://Bishops
            for (let c=1; c<8; c++) {//up right
                if (interaction(piece, row+c, column+c)===OUTSIDE) break;
                else {
                    cellsToMoveTo.push([row+c, column+c]);
                    if (interaction(piece, row+c, column+c)===BLOCKED) break; 
                }
            }
            for (let c=1; c<8; c++) {//down right
                if (interaction(piece, row-c, column+c)===OUTSIDE) break;
                else {
                    cellsToMoveTo.push([row-c, column+c]);
                    if (interaction(piece, row-c, column+c)===BLOCKED) break; 
                }
            }
            for (let c=1; c<8; c++) {//down left
                if (interaction(piece, row-c, column-c)===OUTSIDE) break;
                else {
                    cellsToMoveTo.push([row-c, column-c]);
                    if (interaction(piece, row-c, column-c)===BLOCKED) break; 
                }
            }
            for (let c=1; c<8; c++) {//up left
                if (interaction(piece, row+c, column-c)===OUTSIDE) break;
                else {
                    cellsToMoveTo.push([row+c, column-c]);
                    if (interaction(piece, row+c, column-c)===BLOCKED) break; 
                }
            }
            break;
        case 'P': case 'p'://Pawns need fixin
            let operation=((piece===piece.toUpperCase())?1:-1);
            if (interaction(piece, row+operation, column)!=BLOCKED) {
                cellsToMoveTo.push([row+operation, column]);
                if (row===((piece===piece.toUpperCase())?2:7)&&interaction(piece, operation*2+row, column)!=BLOCKED) {
                    cellsToMoveTo.push([operation*2+row, column]);
                }
            }
            if (column<8) cellsToMoveTo.push([row+operation, column+1]);
            if (column>1) cellsToMoveTo.push([row+operation, column-1]);
            break;
        case 0:default:break;
    }
    return cellsToMoveTo;
}
function interaction(piece, rowTarget, columnTarget) {
    var target=board[rowTarget][columnTarget];
    if (target==='0') return EMPTY;
    else if (target==='-') return OUTSIDE;
    else if ((piece===piece.toUpperCase()&&target===target.toLowerCase())||(piece===piece.toUpperCase()&&target===target.toLowerCase())) return CAPTURE;
    else return BLOCKED;
}
function move(columnStart, rowStart, columnEnd, rowEnd) {
    
}
function toCellNotation(row, column) {
    let letter;
    switch(column) {
        case 1: letter='a'; break;
        case 2: letter='b'; break;
        case 3: letter='c'; break;
        case 4: letter='d'; break;
        case 5: letter='e'; break;
        case 6: letter='f'; break;
        case 7: letter='g'; break;
        case 8: letter='h'; break;
    }
    return letter+row;
}