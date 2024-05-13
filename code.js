function test() { console.log("Yay, HTML connects to this external JS file! "); }
function click(e) {
    console.log("Clicked cell at "+e.getBoundingClientRect().left+" "+e.getBoundingClientRect().top);
}