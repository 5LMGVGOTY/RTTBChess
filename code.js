const BOARD = [
        //The data of where the pieces are
        ["R", "N", "B", "Q", "K", "B", "N", "R"], //Row 1, light pieces
        ["P", "P", "P", "P", "P", "P", "P", "P"],
        ["0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0"],
        ["0", "0", "0", "0", "0", "0", "0", "0"],
        ["p", "p", "p", "p", "p", "p", "p", "p"],
        ["r", "n", "b", "q", "k", "b", "n", "r"] //Row 8, dark pieces
    ],
    OBJECTS = [
        //The img tags displayed on the board
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ];
const IMAGES = new Map([
    ["K", "Light_king"],
    ["k", "Dark_king"],
    ["Q", "Light_queen"],
    ["q", "Dark_queen"],
    ["R", "Light_rook"],
    ["r", "Dark_rook"],
    ["N", "Light_knight"],
    ["n", "Dark_knight"],
    ["B", "Light_bishop"],
    ["b", "Dark_bishop"],
    ["P", "Light_pawn"],
    ["p", "Dark_pawn"]
]);
const KEYPRESSES = ["", "", "", "", "", "", "", "", "", ""], //do not think about this too much
    EMPTY = 0,
    CAPTURE = 1,
    BLOCKED = 2,
    LIGHT = 0,
    DRAW = 1,
    DARK = 2,
    BUTTONS = document.getElementsByTagName("button"),
    HTML_BOARD = document.getElementById("board");
var whatToShow = DRAW,
    castles = [true, true, true, true],
    moveLight = [0, 0, 0, 0],
    moveDark = [0, 0, 0, 0];

function init() {
    document.onkeydown = function (event) {
        //do not think about this too much
        KEYPRESSES.push(event.key);
        KEYPRESSES.shift();
        if (
            KEYPRESSES[0] === "ArrowUp" &&
            KEYPRESSES[1] === "ArrowUp" &&
            KEYPRESSES[2] === "ArrowDown" &&
            KEYPRESSES[3] === "ArrowDown" &&
            KEYPRESSES[4] === "ArrowLeft" &&
            KEYPRESSES[5] === "ArrowRight" &&
            KEYPRESSES[6] === "ArrowLeft" &&
            KEYPRESSES[7] === "ArrowRight" &&
            KEYPRESSES[8] === "b" &&
            KEYPRESSES[9] === "a"
        ) {
            document.body.style.backgroundImage = "url('Images/SecretBackground.webp')";
            console.log("30 more lives for you! ");
            document.onkeydown = null;
        }
    };
    for (let cell of document.getElementsByClassName("cell")) cell.addEventListener("click", () => selectCell(cell));
    for (let c = 0; c < 8; c++)
        for (let d = 0; d < 8; d++) {
            let cell = BOARD[c][d];
            if (cell !== "0") {
                let type = IMAGES.get(cell);
                let image = document.createElement("img");
                image.src = "Images/" + type + ".png";
                image.setAttribute("alt", type);
                image.style.top = (7 - c) * 45 + "px";
                image.style.left = d * 45 + "px";
                HTML_BOARD.appendChild(image);
                OBJECTS[c][d] = image;
            }
        }
}

function printBoard() {
    console.log(BOARD.OBJECTS);
}

/** What happens when you press a button */
function inputMove(isLight) {
    whatToShow = isLight ? LIGHT : DARK;
    BUTTONS[LIGHT].setAttribute("disabled", "disabled");
    BUTTONS[DARK].setAttribute("disabled", "disabled");
    BUTTONS[DRAW].removeAttribute("disabled");
    BUTTONS[DRAW].innerText = "Cancel";
    if (isLight) BUTTONS[LIGHT].innerText = "Making light's move...";
    else BUTTONS[DARK].innerText = "Making dark's move...";
}

/** Reset all cell animations */
function resetCellAnims() {
    for (let cell of document.getElementsByClassName("cell")) cell.style.animationName = "";
}

/** What happens when you click on a cell */
function selectCell(cell) {
    let classes = cell.classList;
    let row = +classes[2].charAt(1),
        column = +classes[3].charAt(1);
    let piece = BOARD[row][column];
    const CELL_ANIM = cell.style.animationName;
    resetCellAnims();
    if (CELL_ANIM === "cellAnimYellow" || CELL_ANIM === "cellAnimRed") {
        resetCellAnims();
        BUTTONS[DRAW].innerText = "Resolve moves";
        if (whatToShow === LIGHT) {
            moveLight[2] = column;
            moveLight[3] = row;
            resetCellAnims();
            BUTTONS[LIGHT].innerText = "Light's move made!";
            if (BUTTONS[DARK].innerHTML === "Dark's move") {
                BUTTONS[DARK].removeAttribute("disabled");
                BUTTONS[DRAW].setAttribute("disabled", "disabled");
            }
        } else if (whatToShow === DARK) {
            moveDark[2] = column;
            moveDark[3] = row;
            resetCellAnims();
            BUTTONS[DARK].innerText = "Dark's move made!";
            if (BUTTONS[LIGHT].innerHTML === "Light's move") {
                BUTTONS[LIGHT].removeAttribute("disabled");
                BUTTONS[DRAW].setAttribute("disabled", "disabled");
            }
        } else console.warn("That wasn't supposed to happen :skull:");
        whatToShow = DRAW;
    } else if (CELL_ANIM === "") {
        switch (whatToShow) {
            case DRAW:
                cell.style.animationName = "cellAnimGreen";
                break;
            case LIGHT:
                if (piece === piece.toUpperCase()) {
                    for (let moveOption of movementOptions(piece, row, column)) {
                        document.getElementsByClassName(
                            "r" + moveOption[0] + " c" + moveOption[1]
                        )[0].style.animationName =
                            BOARD[moveOption[0]][moveOption[1]] === "0" ? "cellAnimYellow" : "cellAnimRed";
                    }
                    moveLight[0] = column;
                    moveLight[1] = row;
                    cell.style.animationName = "cellAnimGreen";
                } else alert("This is a piece of your opponent's! ");
                break;
            case DARK:
                if (piece === piece.toLowerCase()) {
                    for (let moveOption of movementOptions(piece, row, column)) {
                        document.getElementsByClassName(
                            "r" + moveOption[0] + " c" + moveOption[1]
                        )[0].style.animationName =
                            BOARD[moveOption[0]][moveOption[1]] === "0" ? "cellAnimYellow" : "cellAnimRed";
                    }
                    moveDark[0] = column;
                    moveDark[1] = row;
                    cell.style.animationName = "cellAnimGreen";
                } else alert("This is a piece of your opponent's! ");
                break;
        }
    }
}

/** What cells pieces can move to */
function movementOptions(piece, row, column, checkForChecks=false) {
    let cellsToMoveTo = [];
    switch (piece) {
        case "K": //Kings TODO add castling TODO add check check
            if (!checkForChecks) {
                if (row < 7) {
                    if (column < 7) cellsToMoveTo.push([row + 1, column + 1]);
                    cellsToMoveTo.push([row + 1, column]);
                    if (column > 0) cellsToMoveTo.push([row + 1, column - 1]);
                }
                if (row > 0) {
                    if (column < 7) cellsToMoveTo.push([row - 1, column + 1]);
                    cellsToMoveTo.push([row - 1, column]);
                    if (column > 0) cellsToMoveTo.push([row - 1, column - 1]);
                }
                if (column < 7) cellsToMoveTo.push([row, column + 1]);
                if (column > 0) cellsToMoveTo.push([row, column - 1]);
            }
            break;
        case "Q": //Light queen
            cellsToMoveTo = cellsToMoveTo.concat(movementOptions("R", row, column), movementOptions("B", row, column));
            break;
        case "q": //Dark queen
            cellsToMoveTo = cellsToMoveTo.concat(movementOptions("r", row, column), movementOptions("b", row, column));
            break;
        case "R":
        case "r": //Rooks
            let piercing = false;
            for (let c = row + 1; c <= 7; c++) {
                //up
                let inter = interaction(piece, BOARD[c][column]);
                cellsToMoveTo.push([c, column]);
                if (inter === BLOCKED) break;
                else if (inter === CAPTURE) {
                    if (piercing || checkForChecks) break;
                    else piercing = true;
                }
            }
            piercing = false;
            for (let c = row - 1; c >= 0; c--) {
                //down
                let inter = interaction(piece, BOARD[c][column]);
                cellsToMoveTo.push([c, column]);
                if (inter === BLOCKED) break;
                else if (inter === CAPTURE) {
                    if (piercing || checkForChecks) break;
                    else piercing = true;
                }
            }
            piercing = false;
            for (let c = column + 1; c <= 7; c++) {
                //right
                let inter = interaction(piece, BOARD[row][c]);
                cellsToMoveTo.push([row, c]);
                if (inter === BLOCKED) break;
                else if (inter === CAPTURE) {
                    if (piercing || checkForChecks) break;
                    else piercing = true;
                }
            }
            piercing = false;
            for (let c = column - 1; c >= 0; c--) {
                //left
                let inter = interaction(piece, BOARD[row][c]);
                cellsToMoveTo.push([row, c]);
                if (inter === BLOCKED) break;
                else if (inter === CAPTURE) {
                    if (piercing || checkForChecks) break;
                    else piercing = true;
                }
            }
            break;
        case "N":
        case "n": //Knights
            let moveOptions = [
                [row + 1, column + 2],
                [row + 2, column + 1],
                [row - 1, column + 2],
                [row - 2, column + 1],
                [row - 1, column - 2],
                [row - 2, column - 1],
                [row + 1, column - 2],
                [row + 2, column - 1]
            ];
            for (let moveOption of moveOptions) {
                if (!(moveOption[0] < 0 || moveOption[0] > 7 || moveOption[1] < 0 || moveOption[1] > 7))
                    cellsToMoveTo.push(moveOption);
            }
            break;
        case "B":
        case "b": //Bishops
            let piercingButForBishops = false;
            for (let c = 1; c < 8; c++) {
                //up right
                if (row + c > 7 || column + c > 7) break;
                else {
                    let inter = interaction(piece, BOARD[row + c][column + c]);
                    cellsToMoveTo.push([row + c, column + c]);
                    if (inter === BLOCKED) break;
                    else if (inter === CAPTURE) {
                        if (piercingButForBishops || checkForChecks) break;
                        else piercingButForBishops = true;
                    }
                }
            }
            piercingButForBishops = false;
            for (let c = 1; c < 8; c++) {
                //down right
                if (row - c < 0 || column + c > 7) break;
                else {
                    let inter = interaction(piece, BOARD[row - c][column + c]);
                    cellsToMoveTo.push([row - c, column + c]);
                    if (inter === BLOCKED) break;
                    else if (inter === CAPTURE) {
                        if (piercingButForBishops || checkForChecks) break;
                        else piercingButForBishops = true;
                    }
                }
            }
            piercingButForBishops = false;
            for (let c = 1; c < 8; c++) {
                //down left
                if (row - c < 0 || column - c < 0) break;
                else {
                    let inter = interaction(piece, BOARD[row - c][column - c]);
                    cellsToMoveTo.push([row - c, column - c]);
                    if (inter === BLOCKED) break;
                    else if (inter === CAPTURE) {
                        if (piercingButForBishops || checkForChecks) break;
                        else piercingButForBishops = true;
                    }
                }
            }
            piercingButForBishops = false;
            for (let c = 1; c < 8; c++) {
                //up left
                if (row + c > 7 || column - c < 0) break;
                else {
                    let inter = interaction(piece, BOARD[row + c][column - c]);
                    cellsToMoveTo.push([row + c, column - c]);
                    if (inter === BLOCKED) break;
                    else if (inter === CAPTURE) {
                        if (piercingButForBishops || checkForChecks) break;
                        else piercingButForBishops = true;
                    }
                }
            }
            break;
        case "P": //Light pawn
            if (interaction(piece, BOARD[row + 1][column]) !== BLOCKED && !checkForChecks) {
                cellsToMoveTo.push([row + 1, column]);
                if (row === 1 && interaction(piece, BOARD[row + 2][column]) !== BLOCKED) {
                    cellsToMoveTo.push([row + 2, column]);
                }
            }
            if (column < 7) cellsToMoveTo.push([row + 1, column + 1]);
            if (column > 0) cellsToMoveTo.push([row + 1, column - 1]);
            break;
        case "p": //Dark pawn
            if (interaction(piece, BOARD[row - 1][column]) !== BLOCKED && !checkForChecks) {
                cellsToMoveTo.push([row - 1, column]);
                if (row === 6 && interaction(piece, BOARD[row - 2][column]) !== BLOCKED) {
                    cellsToMoveTo.push([row - 2, column]);
                }
            }
            if (column < 7) cellsToMoveTo.push([row - 1, column + 1]);
            if (column > 0) cellsToMoveTo.push([row - 1, column - 1]);
            break;
        case 0:
        default:
            break;
    }
    return cellsToMoveTo;
}

/** What would happen if piece would land on target */
function interaction(piece, target) {
    if (target === "0") return EMPTY;
    else if (
        (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
        (piece === piece.toLowerCase() && target === target.toUpperCase())
    )
        return CAPTURE;
    else return BLOCKED;
}

/** Uses advanced logic and processing to determine the outcome of two simultaneous moves */
function moveCheck() {
    BUTTONS[DRAW].setAttribute("disabled", "disabled");
    if (whatToShow !== DRAW) {
        BUTTONS[whatToShow].innerText = (whatToShow === LIGHT ? "Light" : "Dark") + "'s move";
        BUTTONS[whatToShow].removeAttribute("disabled");
        if (!BUTTONS[(whatToShow + 2) % 4].innerText.match("made")) BUTTONS[(whatToShow + 2) % 4].removeAttribute("disabled");
        BUTTONS[DRAW].innerText = "Resolve moves";
        resetCellAnims();
        return;
    }
    BUTTONS[DRAW].innerHTML = "Resolving moves...";
    let lightPriority = true,
        legalLight = true,
        legalDark = true;
    if (interaction("K", BOARD[moveLight[3]][moveLight[2]]) === BLOCKED) {
        if (moveDark[3] === moveLight[3] && moveDark[2] === moveLight[2]) lightPriority = false;
        else legalLight = false;
    }
    if (interaction("k", BOARD[moveDark[3]][moveDark[2]]) === BLOCKED) {
        if (moveDark[3] === moveLight[3] && moveDark[2] === moveLight[2]) lightPriority = true;
        else legalDark = false;
    }
    //TODO implement castling and check checks plus promotion
    move(lightPriority, legalLight, legalDark);
    BUTTONS[LIGHT].innerText = "Light's move";
    BUTTONS[LIGHT].removeAttribute("disabled");
    BUTTONS[DARK].innerText = "Dark's move";
    BUTTONS[DARK].removeAttribute("disabled");
    BUTTONS[DRAW].innerHTML = "Resolve moves";
}

/** Actually moves the pieces AND checks for collisions */
function move(lightPriority, legalLight, legalDark) {
    let imageLight = OBJECTS[moveLight[1]][moveLight[0]],
        imageDark = OBJECTS[moveDark[1]][moveDark[0]];
    let leftLight = moveLight[0] * 45,
        topLight = (7 - moveLight[1]) * 45,
        columnDistanceLight = moveLight[2] - moveLight[0],
        rowDistanceLight = moveLight[3] - moveLight[1],
        leftDark = moveDark[0] * 45,
        topDark = (7 - moveDark[1]) * 45,
        columnDistanceDark = moveDark[2] - moveDark[0],
        rowDistanceDark = moveDark[3] - moveDark[1];
    let c = 0,
        collision = false,
        idC = setInterval(function () {
            leftLight += columnDistanceLight/2;
            imageLight.style.left = leftLight + "px";
            topLight -= rowDistanceLight/2;
            imageLight.style.top = topLight + "px";
            leftDark += columnDistanceDark/2;
            imageDark.style.left = leftDark + "px";
            topDark -= rowDistanceDark/2;
            imageDark.style.top = topDark + "px";
            if (Math.abs(leftLight - leftDark) < 5 && Math.abs(topLight - topDark) < 5 && legalLight && legalDark)
                c = 974;
            if (c >= 89) { // Movement animation is finished, play illegal animation if needed
                if (!legalLight) {
                    imageLight.style.top = (7 - moveLight[1]) * 45 + "px";
                    let d = 1;
                    idL = setInterval(function () {
                        imageLight.style.left = moveLight[0] * 45 + (d % 4 >= 2 ? 5 : -5) + "px";
                        if (d > 8) {
                            imageLight.style.left = moveLight[0] * 45 + "px";
                            clearInterval(idL);
                        } else d++;
                    }, 25);
                }
                if (!legalDark) {
                    imageDark.style.top = (7 - moveDark[1]) * 45 + "px";
                    let d = 1;
                    idD = setInterval(function () {
                        imageDark.style.left = moveDark[0] * 45 + (d % 4 >= 2 ? 5 : -5) + "px";
                        if (d > 8) {
                            imageDark.style.left = moveDark[0] * 45 + "px";
                            clearInterval(idD);
                        } else d++;
                    }, 25);
                }
                clearInterval(idC);
                doDangerousStuffWithTheData(c === 974, lightPriority, legalLight, legalDark);
            } else c++;
        }, 15);
}

/** Changes the BOARD and OBJECTS variables according to the moves' outcome */
function doDangerousStuffWithTheData(collision, lightPriority, legalLight, legalDark) {
    if (collision) { // Remove both OBJECTS
        BOARD[moveLight[1]][moveLight[0]] = "0";
        BOARD[moveDark[1]][moveDark[0]] = "0";
        HTML_BOARD.removeChild(OBJECTS[moveLight[1]][moveLight[0]]);
        HTML_BOARD.removeChild(OBJECTS[moveDark[1]][moveDark[0]]);
        OBJECTS[moveLight[1]][moveLight[0]] = null;
        OBJECTS[moveDark[1]][moveDark[0]] = null;
        return;
    }
    // remove img tags if necessary and change the game arrays
    if (lightPriority && legalLight) {
        if (OBJECTS[moveLight[3]][moveLight[2]] !== null)
            HTML_BOARD.removeChild(OBJECTS[moveLight[3]][moveLight[2]]);
        BOARD[moveLight[3]][moveLight[2]] = BOARD[moveLight[1]][moveLight[0]];
        BOARD[moveLight[1]][moveLight[0]] = "0";
        OBJECTS[moveLight[3]][moveLight[2]] = OBJECTS[moveLight[1]][moveLight[0]];
        OBJECTS[moveLight[1]][moveLight[0]] = null;
    }
    if (legalDark) {
        if (OBJECTS[moveDark[3]][moveDark[2]] !== null)
            HTML_BOARD.removeChild(OBJECTS[moveDark[3]][moveDark[2]]);
        BOARD[moveDark[3]][moveDark[2]] = BOARD[moveDark[1]][moveDark[0]];
        BOARD[moveDark[1]][moveDark[0]] = "0";
        OBJECTS[moveDark[3]][moveDark[2]] = OBJECTS[moveDark[1]][moveDark[0]];
        OBJECTS[moveDark[1]][moveDark[0]] = null;
    }
    if (!lightPriority && legalLight) {
        if (OBJECTS[moveLight[3]][moveLight[2]] !== null)
            HTML_BOARD.removeChild(OBJECTS[moveLight[3]][moveLight[2]]);
        BOARD[moveLight[3]][moveLight[2]] = BOARD[moveLight[1]][moveLight[0]];
        BOARD[moveLight[1]][moveLight[0]] = "0";
        OBJECTS[moveLight[3]][moveLight[2]] = OBJECTS[moveLight[1]][moveLight[0]];
        OBJECTS[moveLight[1]][moveLight[0]] = null;
    }
}
