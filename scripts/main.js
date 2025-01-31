const cage = document.getElementById("cage");

let offsetX, offsetY, isDragging = false;

cage.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - cage.getBoundingClientRect().left;
    offsetY = e.clientY - cage.getBoundingClientRect().top;
    draggable.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        /* Add min and max so it doesn't go out of bounds*/
        cage.style.left = `${e.clientX - offsetX}px`;
        cage.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    draggable.style.cursor = "grab";
});