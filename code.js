let board=[
    [3, 4, 5, 2, 1, 5, 4, 3], //Row 1, white pieces
    [6, 6, 6, 6, 6, 6, 6, 6], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0], 
    [12, 12, 12, 12, 12, 12, 12, 12], 
    [9, 10, 11, 8, 7, 11, 10, 9]//Row 8, black pieces
];
function testConnection() {
    console.log("Yay, HTML connects to this external JS file! ");
    for (let cell of document.getElementsByClassName("cell")) cell.addEventListener('click', () => selectCell(cell));
}
function selectCell(cell) {
    let classes=cell.classList;
    let row= +classes[2].charAt(1)-1, column= +classes[3].charAt(1);
    let letter;
    switch(column) {
        case 1:letter='a';break;
        case 2:letter='b';break;
        case 3:letter='c';break;
        case 4:letter='d';break;
        case 5:letter='e';break;
        case 6:letter='f';break;
        case 7:letter='g';break;
        case 8:letter='h';break;
    }
    console.log("Clicked cell at "+letter+(row+1));
    let piece=board[row][column];
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
            for (let element of document.getElementsByClassName("r"+row)) {
                if (element.classList.contains("c"+column)) element.style.background="yellow";
            }
        }
    }
    cell.style.background="green";
}
function movementOptions(piece, row, column) {
    let cellsToMoveTo=[];
    switch(piece) {
        case 1: case 7://Kings
            if (column<7&&row>0&&board[row-1][column+1]==0) cellsToMoveTo.append([row-1, column+1]);
            if (column<7&&board[row][column+1]==0) cellsToMoveTo.append([row, column+1]);
            if (column<7&&row<7&&board[row+1][column+1]==0) cellsToMoveTo.append([row+1, column+1]);
            if (row<7&&board[row+1][column]==0) cellsToMoveTo.append([row+1, column]);
            if (column>0&&row<7&&board[row+1][column-1]==0) cellsToMoveTo.append([row+1, column-1]);
            if (column>0&&board[row][column-1]==0) cellsToMoveTo.append([row, column-1]);
            if (column>0&&row>0&&board[row-1][column-1]==0) cellsToMoveTo.append([row-1, column-1]);
            if (row>0&&board[row-1][column]==0) cellsToMoveTo.append([row-1, column]);
            break;
        case 2: case 8://Queens
            
            break;
        case 3: case 9://Rooks
            
            break;
        case 4: case 10://Knights
            
            break;
        case 5: case 11://Bishops
            
            break;
        case 6: case 12://Pawns
            
            break;
        case 0:default:break;
    } return cellsToMoveTo;
}
function move(columnStart, rowStart, columnEnd, rowEnd) {
    
}