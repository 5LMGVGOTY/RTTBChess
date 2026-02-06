# RTTBChess

## Rules

Movement rules of standart chess apply.

Players move at the same time. You can try to move over an enemy piece or pretake one of yours, but
**if your move ends up being illegal, it is not played**.

Kings may not move into check, but **may stay in check**.

Should both moved pieces land on the same <u>occupied space</u>, captures are resolved in order,
**the piece of the colour of the occupant capturing last**.

Should both moved pieces land on the same <u>empty square</u> or try to <u>take each other</u>,
**they are both removed** *except for* kings.

Your opponent wins if **your king gets captured but not theirs** (capture) <u>or</u> if you have
**no possible moves and your king is in check**.

The game ends in a draw under standart chess circumstances *and* when both kings are captured
or checkmated **on the same turn** (capture has priotity over checkmate).

Lack of mating material is now only the case when **only one bishop or knight remains**.

## TODO

evading capture shouldn't work towards the capturing piece?
Castling
Promotion
FEN to position and back (position [move turn] castling [enPassant] halfmovesSincePawnOrCapture [fullmoves])
