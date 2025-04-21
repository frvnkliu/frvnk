import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.174.0/three.module.min.js';


const axesHelper = new THREE.AxesHelper(100);

const cage1 = document.getElementById("cage1");
const cage2 = document.getElementById("cage2");
const cage3 = document.getElementById("cage3");

export const cageScales = [1, 1, 1];
//#region Cage1

const scene1 = new THREE.Scene();
// Create two separate cameras
let camera1 = new THREE.PerspectiveCamera(75, 1, 1, 1000);
camera1.position.set(0, 0, 125);


// Create two renderers, one for each div
let renderer1 = new THREE.WebGLRenderer({ alpha: true });
renderer1.setSize(cage1.clientWidth, cage1.clientHeight);
cage1.appendChild(renderer1.domElement);

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
const centerSphere1 = new THREE.Mesh(centerSphereGeometry, centerSphereMaterial);
// Add the sphere to the spirit group
scene1.add(centerSphere1);
spirit.position.set(0,0,0);
scene1.add(spirit);

let tubularSegments = 64;
let increasing = true; // Direction flag
const minSegments = 3;
const maxSegments = 64;
const speed = 0.5; // Adjust this for smoother/slower animation

let rotationSpeed1 = 0.05;

function updateSpirit(deltaTime){
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
//#endregion

//#region Cage2
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

scene2.add(centerSphere2);

function createRing(innerRadius = 48, outerRadius = 64){
    const ring = new THREE.Group();

    // Create a hollow cylinder using a CylinderGeometry with different radii
    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    ringShape.holes.push(holePath);

    const extrudeSettings = {
        steps: 1,
        depth: 16,
        bevelEnabled: false,
        bevelThickness: 2,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1
    };

    const ringGeometry = new THREE.ExtrudeGeometry(ringShape, extrudeSettings);
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        wireframe: true, // Enables wireframe mode
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);

    ringMesh.position.set(0, 0, 0);
    ring.add(ringMesh);
    return ring;
}

const ringParams = [
    {
        outerRadius: 64,
        innerRadius: 52,
    },
    {
        outerRadius: 64,
        innerRadius: 52,
    }
];
const rings = ringParams.map((params) => createRing(params.innerRadius, params.outerRadius));
for(const ring of rings){
    ringsGroup.add(ring);
}


scene2.add(ringsGroup);
const ringAxes = [ new THREE.Vector3(1,0,0),  new THREE.Vector3(0,1,0)];

const ringSpeeds = [ [0.05, 0.005], [0.1, 0.01] ];

function updateRings(deltaTime){
    for(let i = 0; i < rings.length; i++){
        const ring = rings[i];
        const [zSpeed, axisSpeed] = ringSpeeds[i];

        ring.rotation.z += zSpeed * deltaTime * cageScales[1];
        ring.rotateOnWorldAxis( ringAxes[i], axisSpeed * deltaTime * cageScales[1] );
    }
}
//#endregion

//#region Cage3
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

function createCube(x, y, z, color = 0xff0000) {
    const group = new THREE.Group();
  
    const geometry = new THREE.BoxGeometry(70, 70, 70);
  
    const fillMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.0,
    });
  
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color,
      wireframe: true,
    });
  
    const fillCube = new THREE.Mesh(geometry, fillMaterial);
    const wireCube = new THREE.Mesh(geometry, wireframeMaterial);
  
    group.add(fillCube);
    group.add(wireCube);
  
    group.position.set(x, y, z);
    return group;
  }


const star = new THREE.Group();

const cubes = [createCube(0, 0, 0, 0x000000), createCube(0, 0, 0, 0x000000), createCube(0, 0, 0, 0x000000)];

for(const cube of cubes){
    star.add(cube);
}

const cubeAxes = [ new THREE.Vector3(0.5,0.5,0),  new THREE.Vector3(0,0.5, 0.5), new THREE.Vector3(0.5,0,0.5)];
const cubeSpeeds = [0.1, 0.1, 0.1];

//irregular animation
function updateCubes(deltaTime){
    for(let i = 0; i < cubes.length; i++){
        const cube = cubes[i];
        const axisSpeed = cubeSpeeds[i];
        cube.rotateOnWorldAxis( cubeAxes[i], axisSpeed * deltaTime * cageScales[2]);
    }
}

scene3.add(star);

//#endregion

//#region Cage
const scene = new THREE.Scene();
// Create two separate cameras
const cage = document.getElementById("cage");

let camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
camera.position.set(0, 0, 125);

let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(cage.clientWidth, cage.clientHeight);
cage.appendChild(renderer.domElement);
//const centerSphere = new THREE.Mesh(centerSphereGeometry, centerSphereMaterial);
// Add the sphere to the spirit group
//scene.add(centerSphere);

//#endregion

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    // Get the time delta in seconds since the last frame
    const deltaTime = clock.getDelta()*10;
    
    updateSpirit(deltaTime);
    updateRings(deltaTime);
    updateCubes(deltaTime);
    // Render the scene

    renderer1.render(scene1, camera1);
    renderer2.render(scene2, camera2);
    renderer3.render(scene3, camera3);
    renderer.render(scene, camera);
}

animate();

function onWindowResize() {
    renderer.setSize(cage.clientWidth, cage.clientHeight);
    renderer1.setSize(cage1.clientWidth, cage1.clientHeight);
    renderer2.setSize(cage2.clientWidth, cage2.clientHeight);
    renderer3.setSize(cage3.clientWidth, cage3.clientHeight);
}

// Add event listener for window resize
window.addEventListener('resize', onWindowResize);

//calamaity


export function collapse(){
    cage.style.zIndex = 10;
    scene.add(centerSphere1);
    scene.add(spirit);
    scene.add(ringsGroup);
    scene.add(star);
    //combine everything into a single scene 
}