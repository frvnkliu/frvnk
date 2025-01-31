//const cage1 = document.getElementById("cage1");

let offsetX, offsetY, draggedCage = null;

let cages = document.getElementsByClassName("cage");


for (let cage of cages) {
    cage.addEventListener("mousedown", (e) => {
        draggedCage = cage;
        offsetX = e.clientX - cage.getBoundingClientRect().left;
        offsetY = e.clientY - cage.getBoundingClientRect().top;
        cage.style.cursor = "grabbing";
    });
}

document.addEventListener("mousemove", (e) => {
    if (draggedCage) {
        /* Add min and max so it doesn't go out of bounds*/
        draggedCage.style.left = `${e.clientX - offsetX}px`;
        draggedCage.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener("mouseup", () => {
    draggedCage.style.cursor = "grab";
    draggedCage = null;
});