var board=[
    [3, 4, 5, 2, 1, 5, 4, 3], //Row 1, white pieces
    [6, 6, 6, 6, 6, 6, 6, 6], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [12, 12, 12, 12, 12, 12, 12, 12], 
    [9, 10, 11, 8, 7, 11, 10, 9]//Row 8, black pieces
];
const EMPTY=0, CAPTURE=1, BLOCKED=2;
function testConnection() {
    console.log("Yay, HTML connects to this external JS file! ");
    for (let cell of document.getElementsByClassName("cell")) cell.addEventListener('click', () => selectCell(cell));
}
function selectCell(cell) {
    let classes=cell.classList;
    let row= +classes[2].charAt(1)-1, column= +classes[3].charAt(1)-1;
    let piece=board[row][column];
    let desc="";
    switch(piece) {
        case 1: case 7: desc="a king"; break;
        case 2: case 8: desc="a queen"; break;
        case 3: case 9: desc="a rook"; break;
        case 4: case 10: desc="a knight"; break;
        case 5: case 11: desc="a bishop"; break;
        case 6: case 12: desc="a pawn"; break;
        case 0: default: desc="nothing"; break;
    }
    console.log("Clicked cell at "+toCellNotation(row, column)+", there is "+desc+". ");
    if (cell.style.background=="yellow") {
        move();
        for (let div of document.getElementsByClassName("cell")) {
            div.style.background=div.classList.contains("light")?"beige":"dimgray";
        }
    } else {
        for (let div of document.getElementsByClassName("cell")) {
            div.style.background=div.classList.contains("light")?"beige":"dimgray";
        }
        for (let moveOption of movementOptions(piece, row, column)) {
            for (let element of document.getElementsByClassName("r"+(moveOption[0]+1))) {
                if (element.classList.contains("c"+(moveOption[1]+1))) {
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
        case 1: case 7://Kings
            if (column<7&&row>0&&board[row-1][column+1]==0) cellsToMoveTo.push([row-1, column+1]);
            if (column<7&&board[row][column+1]==0) cellsToMoveTo.push([row, column+1]);
            if (column<7&&row<7&&board[row+1][column+1]==0) cellsToMoveTo.push([row+1, column+1]);
            if (row<7&&board[row+1][column]==0) cellsToMoveTo.push([row+1, column]);
            if (column>0&&row<7&&board[row+1][column-1]==0) cellsToMoveTo.push([row+1, column-1]);
            if (column>0&&board[row][column-1]==0) cellsToMoveTo.push([row, column-1]);
            if (column>0&&row>0&&board[row-1][column-1]==0) cellsToMoveTo.push([row-1, column-1]);
            if (row>0&&board[row-1][column]==0) cellsToMoveTo.push([row-1, column]);
            break;
        case 2: case 8://Queens
            cellsToMoveTo=cellsToMoveTo.concat(movementOptions(piece+1, row, column), movementOptions(piece+3, row, column));
            break;
        case 3: case 9://Rooks
            for (let c=row+1; c<8; c++) {
                let target=interaction(piece, c, column);
                if (target==EMPTY) cellsToMoveTo.push([c, column]);
                else if (target==CAPTURE) {
                    cellsToMoveTo.push([c, column]);
                    break;
                } else break;
            }
            for (let c=row-1; c>=0; c--) {
                let target=interaction(piece, c, column);
                if (target==EMPTY) cellsToMoveTo.push([c, column]);
                else if (target==CAPTURE) {
                    cellsToMoveTo.push([c, column]);
                    break;
                } else break;
            }
            for (let c=column+1; c<8; c++) {
                let target=interaction(piece, row, c);
                if (target==EMPTY) cellsToMoveTo.push([row, c]);
                else if (target==CAPTURE) {
                    cellsToMoveTo.push([row, c]);
                    break;
                } else break;
            }
            for (let c=column-1; c>=0; c++) {
                let target=interaction(piece, row, c);
                if (target==EMPTY) cellsToMoveTo.push([row, c]);
                else if (target==CAPTURE) {
                    cellsToMoveTo.push([row, c]);
                    break;
                } else break;
            }
            break;
        case 4: case 10://Knights
            let moveOptions=[[row+1, column+2], [row+2, column+1], [row-1, column+2], [row-2, column+1], 
                             [row-1, column-2], [row-2, column-1], [row+1, column-2], [row+2, column-1]];
            for (let moveOption of moveOptions) {
                if (moveOption[0]<0||moveOption[0]>7||moveOption[1]<0||moveOption[1]>7) continue;
                else {
                    let target=interaction(piece, moveOption[0], moveOption[1]);
                    if (target==EMPTY||target==CAPTURE) cellsToMoveTo.push([moveOption[0], moveOption[1]]);
                    else continue;
                }
            }
            break;
        case 5: case 11://Bishops
            let upRight=row>column?row:column, downLeft=row>column?column:row, upLeft=row>7-column?row:column, downRight=7-row>column?row:column;
            for (let c=0; c<7-upRight; c++) {
                let target=interaction(piece, row+c, column+c);
                if (target==EMPTY) cellsToMoveTo.push([row+c, column+c]);
                else if (target==CAPTURE) {
                    cellsToMoveTo.push([row+c, column+c]);
                    break;
                } else break;
            }
            for (let c=0; c<downLeft; c++) {
                let target=interaction(piece, row-c, column-c);
                if (target==EMPTY) cellsToMoveTo.push([row-c, column-c]);
                else if (target==CAPTURE) {
                    cellsToMoveTo.push([row-c, column-c]);
                    break;
                } else break;
            }
            for (let c=0; c<upLeft; c++) {
                let target=interaction(piece, row+c, column-c);
                if (target==EMPTY) cellsToMoveTo.push([row+c, column-c]);
                else if (target==CAPTURE) {
                    cellsToMoveTo.push([row+c, column-c]);
                    break;
                } else break;
            }
            for (let c=0; c<downRight; c++) {
                let target=interaction(piece, row-c, column+c);
                if (target==EMPTY) cellsToMoveTo.push([row-c, column+c]);
                else if (target==CAPTURE) {
                    cellsToMoveTo.push([row-c, column+c]);
                    break;
                } else break;
            }
            break;
        case 6: case 12://Pawns
            let operation=piece==6?1:-1;
            if (interaction(piece, row+operation, column)==EMPTY) {
                cellsToMoveTo.push([row+operation, column]);
                if (row==piece==6?1:6&&interaction(piece, operation*2+row, column)==EMPTY) cellsToMoveTo.push([row+operation*2, column]);
            }
            if (column<7&&interaction(piece, row+operation, column+1)==CAPTURE) cellsToMoveTo.push([row+operation, column+1]);
            if (column>0&&interaction(piece, row+operation, column-1)==CAPTURE) cellsToMoveTo.push([row+operation, column-1]);
            break;
        case 0:default:break;
    }
    return cellsToMoveTo;
}
function interaction(piece, rowTarget, columnTarget) {
    var target=board[rowTarget][columnTarget];
    if (target==0) return EMPTY;
    else if ((piece<7&&target>6)||(piece>6&&target<7)) return CAPTURE;
    else return BLOCKED;
}
function move(columnStart, rowStart, columnEnd, rowEnd) {
    
}
function toCellNotation(row, column) {
    let letter;
    switch(column) {
        case 0: letter='a'; break;
        case 1: letter='b'; break;
        case 2: letter='c'; break;
        case 3: letter='d'; break;
        case 4: letter='e'; break;
        case 5: letter='f'; break;
        case 6: letter='g'; break;
        case 7: letter='h'; break;
    }
    return letter+(row+1);
}