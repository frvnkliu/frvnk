import * as THREE from './three.module.js';

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(100);

const cage1 = document.getElementById("cage1");
const cage2 = document.getElementById("cage2");
const cage3 = document.getElementById("cage3");

export const cageScales = [1, 1, 1];
/* === Cage 1 Beginning === */
scene.add(axesHelper);
// Create two separate cameras
let camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
camera.position.set(0, 0, 125);


// Create two renderers, one for each div
let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(cage1.clientWidth, cage1.clientHeight);
cage1.appendChild(renderer.domElement);

// Group both the solid object and the wireframe
let spirit = new THREE.Group();

let torusGeometry = new THREE.TorusKnotGeometry(42, 12, 64, 8, 6, 9);

const solidMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

let edgesGeometry = new THREE.EdgesGeometry(torusGeometry);
let edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black edges
let wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);

let solidTorusKnot = new THREE.Mesh(torusGeometry, solidMaterial);

spirit.add(solidTorusKnot);
spirit.add(wireframe);

const centerSphereGeometry = new THREE.SphereGeometry(5, 16, 16); // Small sphere
const centerSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
const centerSphere = new THREE.Mesh(centerSphereGeometry, centerSphereMaterial);
// Add the sphere to the spirit group
scene.add(centerSphere);
spirit.position.set(0,0,0);
scene.add(spirit);

let tubularSegments = 64;
let increasing = true; // Direction flag
const minSegments = 3;
const maxSegments = 64;
const speed = 0.5; // Adjust this for smoother/slower animation

let rotationSpeed1 = 0.05;

function updateSpirit1(deltaTime){
    // Smoothly update tubularSegments
    if (increasing) {
        tubularSegments += deltaTime * speed;
        if (tubularSegments >= maxSegments) {
            tubularSegments = maxSegments;
            increasing = false; // Switch direction
        }
    } else {
        tubularSegments -= deltaTime * speed;
        if (tubularSegments <= minSegments) {
            tubularSegments = minSegments;
            increasing = true; // Switch direction
        }
    }

    // Recreate torus geometry with updated segments
    torusGeometry.dispose(); // Free old geometry
    torusGeometry = new THREE.TorusKnotGeometry(42, 12, Math.round(tubularSegments), 8, 6, 9);

    // Update the solid torus knot
    solidTorusKnot.geometry.dispose();
    solidTorusKnot.geometry = torusGeometry;

    // Update the wireframe using LineSegments
    const edgesGeometry = new THREE.EdgesGeometry(torusGeometry);
    wireframe.geometry.dispose();
    wireframe.geometry = edgesGeometry;
    spirit.rotation.x += rotationSpeed1 * deltaTime*cageScales[0];
    spirit.rotation.y += rotationSpeed1 * deltaTime*cageScales[0];
}
/* === Cage 1 End === */


/* === Cage 2 Beginning === */

const scene2 = new THREE.Scene();
// Create two separate cameras
const camera2 = new THREE.PerspectiveCamera(75, 1, 1, 1000);
camera2.position.set(0, 0, 125);


// Create two renderers, one for each div
let renderer2 = new THREE.WebGLRenderer({ alpha: true });
renderer2.setSize(cage2.clientWidth, cage2.clientHeight);
cage2.appendChild(renderer2.domElement);

let ringsGroup = new THREE.Group();
const centerSphere2 = new THREE.Mesh(centerSphereGeometry, centerSphereMaterial);

ringsGroup.add(centerSphere2);

function createRing(ringParams){
    const ring = new THREE.group();

    // Define outer and inner radii
    const outerRadius = 72;
    const innerRadius = 70;

    // Create a hollow cylinder using a CylinderGeometry with different radii
    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    ringShape.holes.push(holePath);

    const extrudeSettings = {
        steps: 2,
        depth: 16,
        bevelEnabled: false,
        bevelThickness: 2,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1
    };

    const ringGeometry = new THREE.ExtrudeGeometry(ringShape, extrudeSettings);
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000, // Red
        wireframe: true, // Enables wireframe mode
        transparent: true,
        opacity: 0.5 // Optional transparency
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    scene.add(ringMesh);

    ringMesh.position.set(0, 0, -8);
    return ring;
}

scene2.add(ringsGroup);
const rings = [];
const rotations = [
    [0, 1, 0],
    [1, 1 ,0]
];

const ringRotationSpeeds = [
    [0.10, 0.005],
    [0.15, 0.010]
]

function updateRings(deltaTime){
    for(let i = 0; i < rings.length; i++){
        const ring = rings[i];
        ring.rotation.z += ringRotationSpeeds[i][0] * deltaTime*cageScales[1];
        ring.rotateOnWorldAxis(new THREE.Vector3(rotations[i]), ringRotationSpeeds[i][1]*cageScale[1]);
    }
}

/* === Cage 2 End === */

/* === Cage 3 Beginning === */
const scene3 = new THREE.Scene();
// Create two separate cameras
const camera3 = new THREE.PerspectiveCamera(75, 1, 1, 1000);
camera3.position.set(0, 0, 125);

// Create two renderers, one for each div
let renderer3 = new THREE.WebGLRenderer({ alpha: true });
renderer3.setSize(cage3.clientWidth, cage3.clientHeight);
cage3.appendChild(renderer3.domElement);
const centerSphere3 = new THREE.Mesh(centerSphereGeometry, centerSphereMaterial);

scene3.add(centerSphere3);
let rotationSpeed3 = 1;

/* === Cage 3 End === */

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    // Get the time delta in seconds since the last frame
    const deltaTime = clock.getDelta()*10;
    
    updateSpirit1(deltaTime);
    updateRings(deltaTime);
    // Render the scene

    renderer.render(scene, camera);
    renderer2.render(scene2, camera2);
    renderer3.render(scene3, camera3);
}

animate();

function onWindowResize() {
    // Update the size of the renderer
    renderer.setSize(cage1.clientWidth, cage1.clientHeight);
    renderer2.setSize(cage2.clientWidth, cage2.clientHeight);
    renderer3.setSize(cage3.clientWidth, cage3.clientHeight);
}

// Add event listener for window resize
window.addEventListener('resize', onWindowResize);

//calamaity
export function collapse(){
    for(let i = 0; i< 3; i++){
        //cageScales[i] = 9;
    }
    console.log("Hi");
    //combine everything into a single scene
}