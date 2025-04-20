import {collapse, cageScales} from './spirit.js';

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

const cageOverlaps = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]

function calcOverlap(cageA, cageB){
    const cageLength = cageA.clientHeight;
    const cageAX = cageA.getBoundingClientRect().left;
    const cageAY = cageA.getBoundingClientRect().top;
    const cageBX = cageB.getBoundingClientRect().left;
    const cageBY = cageB.getBoundingClientRect().top;
    const diffX = Math.abs(cageAX-cageBX)/cageLength;
    const diffY = Math.abs(cageAY-cageBY)/cageLength;

    return Math.max(1-4*diffX*diffY, 0);
}


//pointer down
for (let cage of cages) {
    cage.addEventListener("pointerdown", e => {
      e.preventDefault();
      draggedCage = cage;
      updateCages(cage);
  
      const rect = cage.getBoundingClientRect();
      const vw   = window.innerWidth;
      const vh   = window.innerHeight;
  
      // 1) Where the element really sits, in % of viewport:
      const startLeftPct = (rect.left / vw) * 100;
      const startTopPct  = (rect.top  / vh) * 100;
  
      // 2) Where the pointer is, in the same % units:
      const pointerPctX = (e.clientX / vw) * 100;
      const pointerPctY = (e.clientY / vh) * 100;
``
      // 3) Your drag‐offset, in percent:
      offsetX = pointerPctX - startLeftPct;
      offsetY = pointerPctY - startTopPct;
  
      cage.setPointerCapture(e.pointerId);
      cage.style.cursor = "grabbing";
    });
  }
  
  
  document.addEventListener("pointermove", e => {
    if (!draggedCage) return;
    e.preventDefault();
  
    const vw = window.innerWidth;
    const vh = window.innerHeight;
  
    // 4) Current pointer pos, in %:
    const pointerPctX = (e.clientX / vw) * 100;
    const pointerPctY = (e.clientY / vh) * 100;
  
    // 5) Subtract your percent‐offset to get the element’s new %‐pos:
    const leftPct = pointerPctX - offsetX;
    const topPct  = pointerPctY - offsetY;
  
    // 6) Write those same % values back in dvw/dvh
    draggedCage.style.left = `${leftPct}dvw`;
    draggedCage.style.top  = `${topPct}dvh`;
    const bg = cageMap.get(draggedCage);
    bg.style.left = `${leftPct}dvw`;
    bg.style.top  = `${topPct}dvh`;

    let draggedCageIdx = parseInt(draggedCage.id.slice(-1),10)-1;
    //Update Overlaps
    for (let cage of cages) {
        if (cage !== draggedCage) {
            const cageIdx = parseInt(cage.id.slice(-1),10)-1;
            cageOverlaps[draggedCageIdx][cageIdx] = cageOverlaps[cageIdx][draggedCageIdx] = calcOverlap(draggedCage, cage);
        }
    }

    //updateScales
    for(let i = 0; i <3 ;i++){
        cageScales[i] = 0;
        for(let j = 0; j < 3; j++){
            cageScales[i] += cageOverlaps[i][j]**2;
        }
        cageScales[i] = cageScales[i]**1.5;
    }
});

// end dragging
document.addEventListener("pointerup", e => {
    if (!draggedCage) return;
    draggedCage.releasePointerCapture(e.pointerId);
    draggedCage.style.cursor = "grab";
    draggedCage = null;
    let totalOverlap = 0;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            totalOverlap += cageOverlaps[i][j];
        }
    }
    console.log(totalOverlap);
    if(totalOverlap > 8.88) start();
});


const startBtn = document.getElementById("start");

let startPositions = [];
let animationStartTime = null;
const animationDuration = 700; // ms, how long the “fly to center” takes

// replace your click handler with this:
function start(){
    // remove the button and disable manual drag
    startBtn.remove();
    cages.forEach(cage => cage.style.pointerEvents = "none");

    // snapshot start positions in percent-space
    startPositions = cages.map(cage => {
    const rect = cage.getBoundingClientRect();
    const vw   = window.innerWidth;
    const vh   = window.innerHeight;

    return {
        left: (rect.left  / vw) * 100,  // e.g. 37.5  means 37.5 dvw
        top:  (rect.top   / vh) * 100,  // e.g. 42.0  means 42 dvh
    };
    });

    // kick off the animation
    animationStartTime = null;
    requestAnimationFrame(animateToCenter);
}

// 1) Click handler
startBtn.addEventListener("click", start);
  
  
  // 2) Animation loop
  function animateToCenter(timestamp) {
    if (!animationStartTime) animationStartTime = timestamp;
    const elapsed = timestamp - animationStartTime;
    const t       = Math.min(elapsed / animationDuration, 1); // 0→1
  
    const vw = window.innerWidth;
    const vh = window.innerHeight;
  
    cages.forEach((cage, i) => {
      const bg = cageMap.get(cage);
      const w  = cage.clientWidth;
      const h  = cage.clientHeight;
  
      // where its top-left corner should be, as a percent:
      const targetLeftPct = ((vw/2 - w/2) / vw) * 100; // e.g. 50% - (w/vw)*50%
      const targetTopPct  = ((vh/2 - h/2) / vh) * 100;
  
      // leap between startPositions[i] → target
      const start = startPositions[i];
      const newLeft = start.left + (targetLeftPct - start.left) * t;
      const newTop  = start.top  + (targetTopPct  - start.top ) * t;
  
      // write dynamic-viewport units
      cage.style.left = `${newLeft}dvw`;
      cage.style.top  = `${newTop}dvh`;
      bg.style.left   = `${newLeft}dvw`;
      bg.style.top    = `${newTop}dvh`;
    });
  
    // update overlap matrix & scales
    for (let i = 0; i < cages.length; i++) {
      for (let j = i + 1; j < cages.length; j++) {
        const ov = calcOverlap(cages[i], cages[j]);
        cageOverlaps[i][j] = cageOverlaps[j][i] = ov;
      }
    }
    for (let i = 0; i < 3; i++) {
      cageScales[i] = 0;
      for (let j = 0; j < 3; j++) {
        cageScales[i] += cageOverlaps[i][j] ** 2;
      }
      cageScales[i] = cageScales[i] ** 1.5;
    }
  
    // continue or finish
    if (t < 1) {
      requestAnimationFrame(animateToCenter);
    } else {
      collapse();
    }
  }