function testConnection() {
    console.log("Yay, HTML connects to this external JS file! ");
    for (let cell of document.getElementsByClassName("cell")) cell.addEventListener('click', () => selectCell(cell));
}
let lastClickedCell=null;
function selectCell(cell) {
    if (lastClickedCell!=null) {
        lastClickedCell.style.background=lastClickedCell.classList.contains("light")?"beige":"dimgray";
    }
    let classes=cell.classList;
    let row= +classes[2].charAt(1), column=classes[3].charAt(1);
    console.log("Clicked cell at "+column+row);
    cell.style.background="green";
    lastClickedCell=cell;
}