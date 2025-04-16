import * as THREE from './three.module.js';

let offsetX, offsetY, draggedCage = null;

let cages = Array.from(document.getElementsByClassName("cage"));
let cageBackgrounds = Array.from(document.getElementsByClassName("cageBackground"));

const cageMap = new Map();

cages.forEach((cage, index) => {
  // Use the same index to access the corresponding cageBackground.
  const background = cageBackgrounds[index];
  cageMap.set(cage, background);
});

function updateCages(currCage){
    let i = cages.indexOf(currCage);
    if (i === -1) return; // Cage not found

    // Remove the current cage from its position
    cages.splice(i, 1);

    // Push it to the end (most recently used)
    cages.push(currCage);

    // Update z-indexes based on order in array
    for (let z = 0; z < cages.length; z++) {
        cages[z].style.zIndex = z+3;
        cageMap.get(cages[z]).style.zIndex = z;
    }
}

function isOverlap(cageA, cageB){
    const cageLength = cageA.clientHeight;
    const cageAX = cageA.getBoundingClientRect().left;
    const cageAY = cageA.getBoundingClientRect().top;
    const cageBX = cageB.getBoundingClientRect().left;
    const cageBY = cageB.getBoundingClientRect().top;
    const diffX = Math.abs(cageAX-cageBX);
    const diffY = Math.abs(cageAY-cageBY);

    const pullThresh = 0.5;
    console.log(`Cage Length: ${cageLength}`)
    console.log(`X: ${diffX}, Y: ${diffY}`);
    return diffX < pullThresh*cageLength && diffY < pullThresh*cageLength;
}

// start dragging
for (let cage of cages) {
    // ensure touch-action:none is in effect
    cage.addEventListener("pointerdown", e => {
        e.preventDefault();            // stop text‐selection, scrolling, etc.
        draggedCage = cage;
        updateCages(draggedCage);

        const rect = cage.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        cage.setPointerCapture(e.pointerId);
        cage.style.cursor = "grabbing";
    });
}

// while dragging
document.addEventListener("pointermove", e => {
    if (!draggedCage) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let leftPx = e.clientX - offsetX;
    let topPx  = e.clientY - offsetY;

    const leftVw = (leftPx / vw) * 100;
    const topVh  = (topPx / vh) * 100;

    draggedCage.style.left = `${leftVw}vw`;
    draggedCage.style.top  = `${topVh}vh`;

    const bg = cageMap.get(draggedCage);
    bg.style.left = `${leftVw}vw`;
    bg.style.top  = `${topVh}vh`;
});

// end dragging
document.addEventListener("pointerup", e => {
    if (!draggedCage) return;

    draggedCage.releasePointerCapture(e.pointerId);
    draggedCage.style.cursor = "grab";

    for (let cage of cages) {
        if (cage !== draggedCage && isOverlap(draggedCage, cage)) {
        console.log("Cage Overlap:", cage.id, draggedCage.id);
        // do overlap logic…
        }
    }
    draggedCage = null;
});


const startText = document.getElementById("start");

startText.addEventListener("click", ()=>{

});