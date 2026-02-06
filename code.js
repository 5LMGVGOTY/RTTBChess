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
    BUTTONS = document.getElementsByClassName("moveButton"),
    HTML_BOARD = document.getElementById("board"),
    LOCAL_SAVE = document.getElementsByName("localSave")[0];
var whatToShow = DRAW,
    castles = { kingsideLight: true, queensideLight: true, queensideDark: true, queensideDark: true },
    moves = { light: {
        current: { row: 0, column: 0 },
        target: { row: 0, column: 0 }
    }, dark: {
        current: { row: 0, column: 0 },
        target: { row: 0, column: 0 }
    } };

function init() {
    document.onkeydown = function (event) {
        //do not think about this too much
        KEYPRESSES.push(event.key);
        KEYPRESSES.shift();
        if (JSON.stringify(KEYPRESSES) == '["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]') {
            document.body.style.backgroundImage = "url('Images/SecretBackground.webp')";
            console.log("30 more lives for you! ");
            document.onkeydown = null;
        }
    };
    const localSave = localStorage.getItem("localSave");
    if (localSave === "true") {
        LOCAL_SAVE.setAttribute("checked", "true");
        const position = localStorage.getItem("position");
        if (position) {
            if (!unfen(position)) localStorage.removeItem("position");
        }
    } else {
        localStorage.setItem("localSave", false);
        localStorage.removeItem("position");
    }
    for (let cell of document.getElementsByClassName("cell")) cell.addEventListener("click", () => selectCell(cell));
    for (let c = 0; c < 8; c++)
        for (let d = 0; d < 8; d++) {
            let cell = BOARD[c][d];
            if (cell === "0") continue;
            let type = IMAGES.get(cell);
            let image = document.createElement("img");
            image.src = "Images/" + type + ".png";
            image.alt = type;
            image.style.top = (7 - c) * 45 + "px";
            image.style.left = d * 45 + "px";
            HTML_BOARD.appendChild(image);
            OBJECTS[c][d] = image;
        }
}

/** Return the field of an array from the given parameters {row, column}
 * Default array is BOARD
 * */
function getFrom(params, array=BOARD) {
    return array[params.row][params.column];
}

/** Set the field of an array from the given parameters {row, column} to the given value
 * Default array is BOARD, default value is 0
 * */
function setFrom(params, value='0', array=BOARD) {
    array[params.row][params.column] = value;
}

/** Check whether the two given moves have the same coords */
function compareMoves(move1, move2) {
    return move1.row === move2.row && move1.column === move2.column;
}

function toggleLocalSave() {
    localStorage.setItem("localSave", LOCAL_SAVE.checked == true);
    if (LOCAL_SAVE.checked != true) localStorage.removeItem("position");
}

/** Return the current board and game state as a pseudo-FEN-notation string */
function fen() {
    let position = "";
    for (let row of BOARD) {
        position += row.join('') + '/';
    }
    position = position.slice(0, position.length - 1);
    return [position].join(' '); // TODO add castling, en passant and half-moves
}

/** Convert the given pseudo-FEN-notation to a position and game state, returns success */
function unfen(position) {
    return false; // TODO
}

/** Download the current position as a pseudo-FEN-notation text file */
function downloadPosition() {
    const link = document.createElement('a');
    link.download = "RTTBChess_position_" + new Date().toISOString() + ".rttbc";
    link.href = URL.createObjectURL(new Blob([fen()], { type: "text/plain" }));
    link.click();
    URL.revokeObjectURL(link.href);
}

/** Prompt for a file, then read it and update the position and game state accordingly */
function importPosition() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = readerEvent => {
            window.alert("Import " + (unfen(readerEvent.target.result) ? "succeeded" : "failed"));
        }
        reader.readAsText(e.target.files[0],'UTF-8');
    }
    input.click();
}

/** Print the current board and object matrices from the user's POV */
function logDebug() {
    for (let index = 7; index >= 0; index--) {
        console.debug(BOARD[index], OBJECTS[index]);
    }
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
            moves.light.target = { row: row, column: column };
            resetCellAnims();
            BUTTONS[LIGHT].innerText = "Light's move made!";
            if (BUTTONS[DARK].innerHTML === "Dark's move") {
                BUTTONS[DARK].removeAttribute("disabled");
                BUTTONS[DRAW].setAttribute("disabled", "disabled");
            }
        } else if (whatToShow === DARK) {
            moves.dark.target = { row: row, column: column };
            resetCellAnims();
            BUTTONS[DARK].innerText = "Dark's move made!";
            if (BUTTONS[LIGHT].innerHTML === "Light's move") {
                BUTTONS[LIGHT].removeAttribute("disabled");
                BUTTONS[DRAW].setAttribute("disabled", "disabled");
            }
        } else console.warn("That wasn't supposed to happen :skull:");
        whatToShow = DRAW;
    } else if (CELL_ANIM === "") {
        if (whatToShow === DRAW) {
            cell.style.animationName = "cellAnimGreen";
            return;
        }
        if (piece === (whatToShow === LIGHT ? piece.toUpperCase() : piece.toLowerCase())) {
            for (let moveOption of movementOptions(piece, row, column)) {
                document.getElementsByClassName(
                    "r" + moveOption[0] + " c" + moveOption[1]
                )[0].style.animationName = cellAnimationIsYellow(piece, moveOption, column) ? "cellAnimYellow" : "cellAnimRed";
            }
            moves[whatToShow === LIGHT ? "light" : "dark"].current = { row: row, column: column };
            cell.style.animationName = "cellAnimGreen";
        } else alert("This is a piece of your opponent's! ");
    } // else animation is green, simply cancel
}

/** Checks if the piece should take or move to the given square */
function cellAnimationIsYellow(piece, moveOption, column) {
    if (piece.toUpperCase() === 'P') {
        return moveOption[1] === column
    }
    return BOARD[moveOption[0]][moveOption[1]] === '0'
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
        case "p": //Dark pawn
            const ROWMOD = piece === 'P' ? 1 : -1;
            if (interaction(piece, BOARD[row + ROWMOD][column]) !== BLOCKED && !checkForChecks) {
                cellsToMoveTo.push([row + ROWMOD, column]);
                if (row === parseInt(-2.5 * ROWMOD + 3.5) && interaction(piece, BOARD[row + (2 * ROWMOD)][column]) !== BLOCKED) {
                    cellsToMoveTo.push([row + (2 * ROWMOD), column]);
                }
            }
            if (column < 7) cellsToMoveTo.push([row + ROWMOD, column + 1]);
            if (column > 0) cellsToMoveTo.push([row + ROWMOD, column - 1]);
            break;
        case 0:
        default:
            break;
    }
    return cellsToMoveTo;
}

/** What would happen if piece would land on the target square */
function interaction(piece, target) {
    if (target === "0") return EMPTY;
    else if (
        (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
        (piece === piece.toLowerCase() && target === target.toUpperCase())
    )
        return CAPTURE;
    else return BLOCKED;
}

/** Returns whether the pawn move is valid */
function simplePawnLogic(piece) {
    const move = moves[piece === 'P' ? "light" : "dark"];
    const ACTION = interaction(piece, getFrom(move.target));
    if (Math.abs(move.current.row - move.target.row) === 2) { // if the pawn moves 2 squares
        const action2 = interaction(piece, BOARD[move.target.row - ((move.current.row % 6) * 2 - 1)][move.target.column]);
        return ACTION === EMPTY && action2 === EMPTY;
    }
    return ACTION === (Math.abs(move.current.column - move.target.column) === 1 ? CAPTURE : EMPTY);
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
    let priority = DRAW, enPassantFlag = DRAW,
        legalLight = true, legalDark = true;
    //TODO implement castling and promotion and check
    if (getFrom(moves.light.current) === 'P') { // if light moves a pawn
        const LIGHT_PAWN_TAKES = Math.abs(moves.light.current.column - moves.light.target.column) === 1;
        if (getFrom(moves.dark.current) === 'p') { // if dark moves a pawn too
            const DARK_PAWN_TAKES = Math.abs(moves.dark.current.column - moves.dark.target.column) === 1;
            if (Math.abs(moves.light.current.column - moves.dark.current.column) === 1
                && Math.abs(moves.light.current.row - moves.dark.current.row) === 2) { // if they are one knight away
                if (moves.dark.current.row === 6 && moves.dark.target.row === 4 && moves.light.target.column === moves.dark.target.column) { // if light can en passant
                    const allowed = simplePawnLogic('p');
                    return move(allowed, allowed, DARK, DARK);
                }
                if (moves.light.current.row === 1 && moves.light.target.row === 3 && moves.light.target.column === moves.dark.target.column) { // if dark can en passant
                    const allowed = simplePawnLogic('P');
                    return move(allowed, allowed, LIGHT, LIGHT);
                }
            }
            if (compareMoves(moves.light.target, moves.dark.target)) { // if they both target the same square
                const PIECE = getFrom(moves.light.target), EMPTY = PIECE === '0';
                if (LIGHT_PAWN_TAKES) {
                    if (DARK_PAWN_TAKES) { // if dark wants to take too
                        return move(!EMPTY, !EMPTY, PIECE === PIECE.toUpperCase() ? DARK : LIGHT); // only legal if not empty (order)
                    } // else check if the space is free
                    if (EMPTY) return move(true, true, DARK); // if it is, let dark move onto it first
                    return move(false, false);
                }
                if (DARK_PAWN_TAKES) { // if dark takes but not light
                    if (EMPTY) return move(true, true, LIGHT); // if the space is empty, let light move onto it first
                    return move(false, false);
                }
                return move(EMPTY, EMPTY); // only legal if empty (collision)
            }
            if (compareMoves(moves.light.target, moves.dark.current)) { // if light wants to go onto dark
                if (compareMoves(moves.dark.target, moves.light.current)) { // if both want to go onto each other
                    return move(LIGHT_PAWN_TAKES, LIGHT_PAWN_TAKES);
                }
                const ALLOWED = simplePawnLogic('p');
                return move(ALLOWED !== LIGHT_PAWN_TAKES, ALLOWED, DARK);
            }
            if (compareMoves(moves.light.current, moves.dark.target)) { // if dark wants to go onto light
                const ALLOWED = simplePawnLogic('P');
                return move(ALLOWED, ALLOWED !== DARK_PAWN_TAKES, LIGHT);
            }
            return move(simplePawnLogic('P'), simplePawnLogic('p'));
        }
        if (compareMoves(moves.light.target, moves.dark.target)) { // if both move onto the same space
            const ACTION = interaction('P', getFrom(moves.light.target));
            if (LIGHT_PAWN_TAKES) {
                return move(true, true, ACTION === CAPTURE ? LIGHT : DARK);
            }
            return move(ACTION === EMPTY, interaction('p', getFrom(moves.dark.target)) !== BLOCKED, LIGHT);
        }
        if (compareMoves(moves.light.target, moves.dark.current)) { // if light's pawn wants to move onto dark
            if (compareMoves(moves.dark.target, moves.light.current)) { // if both move onto each other
                return move(LIGHT_PAWN_TAKES, !LIGHT_PAWN_TAKES); // only one takes
            }
            const ALLOWED = interaction('p', getFrom(moves.dark.target)) !== BLOCKED;
            return move(ALLOWED === !LIGHT_PAWN_TAKES, ALLOWED);
        }
        if (compareMoves(moves.dark.target, moves.light.current)) { // if dark wants to move onto light's pawn
            priority = LIGHT;
        }
        legalLight = simplePawnLogic('P');
    }
    if (getFrom(moves.dark.current) === 'p') { // if only dark moves a pawn
        const DARK_PAWN_TAKES = Math.abs(moves.dark.current.column - moves.dark.target.column) === 1;
        if (compareMoves(moves.light.target, moves.dark.target)) { // if both move onto the same space
            const ACTION = interaction('p', getFrom(moves.dark.target));
            if (DARK_PAWN_TAKES) {
                return move(true, true, ACTION === CAPTURE ? DARK : LIGHT);
            }
            return move(interaction('P', getFrom(moves.light.target)) !== BLOCKED, ACTION === EMPTY, DARK);
        }
        if (compareMoves(moves.dark.target, moves.light.current)) { // if dark's pawn wants to move onto light
            if (compareMoves(moves.light.target, moves.dark.current)) { // if both move onto each other
                return move(!DARK_PAWN_TAKES, DARK_PAWN_TAKES); // only one takes
            }
            const ALLOWED = interaction('P', getFrom(moves.light.target)) !== BLOCKED;
            return move(ALLOWED, ALLOWED === !DARK_PAWN_TAKES);
        }
        if (compareMoves(moves.dark.target, moves.light.current)) { // if light wants to move onto dark's pawn
            priority = DARK;
        }
        legalDark = simplePawnLogic('p');
    }
    if (interaction(getFrom(moves.light.current), getFrom(moves.light.target)) === BLOCKED) {
        if (compareMoves(moves.light.target, moves.dark.target)) priority = DARK;
        else legalLight = false;
    }
    if (interaction(getFrom(moves.dark.current), getFrom(moves.dark.target)) === BLOCKED) {
        if (compareMoves(moves.light.target, moves.dark.target)) priority = LIGHT;
        else legalDark = false;
    }
    move(legalLight, legalDark, priority);
}

/** Actually move the pieces
 * @param  {Boolean} legalLight Whether light's move is legal
 * @param  {Boolean} legalLight Whether dark's move is legal
 * @param  {Ternary} priority Whether a move must happen before another (default DRAW)
 * @param  {Ternary} enPassantFlag Whether an en passant is occuring (default DRAW)
 */
function move(legalLight=true, legalDark=true, priority=DRAW, enPassantFlag=DRAW) {
    let imageLight = getFrom(moves.light.current, OBJECTS), imageDark = getFrom(moves.dark.current, OBJECTS);
    let leftLight = moves.light.current.column * 45, topLight = (7 - moves.light.current.row) * 45,
        columnDistanceLight = moves.light.target.column - moves.light.current.column,
        rowDistanceLight = moves.light.target.row - moves.light.current.row,
        leftDark = moves.dark.current.column * 45, topDark = (7 - moves.dark.current.row) * 45,
        columnDistanceDark = moves.dark.target.column - moves.dark.current.column,
        rowDistanceDark = moves.dark.target.row - moves.dark.current.row;
    let c = 0;
    let idC = setInterval(function () {
        leftLight += columnDistanceLight / 2;
        imageLight.style.left = leftLight + "px";
        topLight -= rowDistanceLight / 2;
        imageLight.style.top = topLight + "px";
        leftDark += columnDistanceDark / 2;
        imageDark.style.left = leftDark + "px";
        topDark -= rowDistanceDark / 2;
        imageDark.style.top = topDark + "px";
        if (c >= 89) { // Movement animation is finished, play illegal animation if needed
            if (!legalLight) {
                imageLight.style.top = (7 - moves.light.current.row) * 45 + "px";
                let d = 1;
                const idL = setInterval(function () {
                    imageLight.style.left = moves.light.current.column * 45 + (d % 4 >= 2 ? 5 : -5) + "px";
                    if (d > 8) {
                        imageLight.style.left = moves.light.current.column * 45 + "px";
                        clearInterval(idL);
                    } else d++;
                }, 25);
            }
            if (!legalDark) {
                imageDark.style.top = (7 - moves.dark.current.row) * 45 + "px";
                let d = 1;
                const idD = setInterval(function () {
                    imageDark.style.left = moves.dark.current.column * 45 + (d % 4 >= 2 ? 5 : -5) + "px";
                    if (d > 8) {
                        imageDark.style.left = moves.dark.current.column * 45 + "px";
                        clearInterval(idD);
                    } else d++;
                }, 25);
            }
            clearInterval(idC);
            postMove(legalLight, legalDark, priority, enPassantFlag);
        } else c++;
    }, 15);
}

/** Change the BOARD and OBJECTS variables according to the moves' outcome */
function postMove(legalLight, legalDark, priority, enPassantFlag) {
    if (priority === DRAW && legalLight && legalDark && (compareMoves(moves.light.target, moves.dark.target)
        || (compareMoves(moves.light.target, moves.dark.current) && compareMoves(moves.dark.target, moves.light.current)))) { // Remove both pieces
        setFrom(moves.light.current);
        setFrom(moves.dark.current);
        HTML_BOARD.removeChild(getFrom(moves.light.current, OBJECTS));
        HTML_BOARD.removeChild(getFrom(moves.dark.current, OBJECTS));
        setFrom(moves.light.current, null, OBJECTS);
        setFrom(moves.dark.current, null, OBJECTS);
        return revertButtons();
    }
    // change coords if en passant is occuring
    if (enPassantFlag === DARK) moves.dark.target.row += 1;
    else if (enPassantFlag === LIGHT) moves.light.target.row -= 1;
    // remove img tags if necessary and change the game arrays
    if (priority === LIGHT && legalLight) {
        if (getFrom(moves.light.target, OBJECTS) !== null) HTML_BOARD.removeChild(getFrom(moves.light.target, OBJECTS));
        setFrom(moves.light.target, getFrom(moves.light.current));
        setFrom(moves.light.current);
        setFrom(moves.light.target, getFrom(moves.light.current, OBJECTS), OBJECTS);
        setFrom(moves.light.current, null, OBJECTS);
    }
    if (legalDark) {
        if (getFrom(moves.dark.target, OBJECTS) !== null) HTML_BOARD.removeChild(getFrom(moves.dark.target, OBJECTS));
        setFrom(moves.dark.target, getFrom(moves.dark.current));
        setFrom(moves.dark.current);
        setFrom(moves.dark.target, getFrom(moves.dark.current, OBJECTS), OBJECTS);
        setFrom(moves.dark.current, null, OBJECTS);
    }
    if (priority !== LIGHT && legalLight) {
        if (getFrom(moves.light.target, OBJECTS) !== null) HTML_BOARD.removeChild(getFrom(moves.light.target, OBJECTS));
        setFrom(moves.light.target, getFrom(moves.light.current));
        setFrom(moves.light.current);
        setFrom(moves.light.target, getFrom(moves.light.current, OBJECTS), OBJECTS);
        setFrom(moves.light.current, null, OBJECTS);
    }
    // Save the position according to the parameter
    if (localStorage.getItem("localSave") === "true") {
        localStorage.setItem("position", fen());
    }
    revertButtons();
}

/** Ready the buttons' state and text for the next move */
function revertButtons() {
    BUTTONS[LIGHT].innerText = "Light's move";
    BUTTONS[LIGHT].removeAttribute("disabled");
    BUTTONS[DARK].innerText = "Dark's move";
    BUTTONS[DARK].removeAttribute("disabled");
    BUTTONS[DRAW].innerHTML = "Resolve moves";
}
