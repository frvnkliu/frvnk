import * as THREE from './three.module.js';

const cage1 = document.getElementById("cage1");
const cage2 = document.getElementById("cage2");
const container = document.getElementById("container");

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(100);

// Add it to the scene
scene.add(axesHelper);
// Create two separate cameras
let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.set(0, 0, 180);


// Create two renderers, one for each div
let renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);


// Group both the solid object and the wireframe
let spirit1 = new THREE.Group();

let torusGeometry = new THREE.TorusKnotGeometry(21, 6, 64, 8, 6, 9);

const solidMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

let edgesGeometry = new THREE.EdgesGeometry(torusGeometry);
let edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black edges
let wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);

let solidTorusKnot = new THREE.Mesh(torusGeometry, solidMaterial);

spirit1.add(solidTorusKnot);
spirit1.add(wireframe);

const centerSphereGeometry = new THREE.SphereGeometry(5, 16, 16); // Small sphere
const centerSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
const centerSphere = new THREE.Mesh(centerSphereGeometry, centerSphereMaterial);
// Add the sphere to the spirit group
spirit1.add(centerSphere);
spirit1.position.set(0,0,0);
scene.add(spirit1);

const clock = new THREE.Clock();

let tubularSegments = 64;
let increasing = true; // Direction flag
const minSegments = 3;
const maxSegments = 64;
const speed = 0.5; // Adjust this for smoother/slower animation

let spirit2 = new THREE.Group();
const centerSphere2 = new THREE.Mesh(centerSphereGeometry, centerSphereMaterial);
spirit2.add(centerSphere2);
spirit2.position.set(300,-300,0);

// Create a tetrahedron with radius 42
const tetraGeometry = new THREE.TetrahedronGeometry(21); // Radius of 42
const tetraMaterial = new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true }); // Orange wireframe
const tetrahedron = new THREE.Mesh(tetraGeometry, tetraMaterial);

// Add tetrahedron to spirit2
spirit2.add(tetrahedron);
const axesHelper2 = new THREE.AxesHelper(100);

// Add it to the scene
spirit2.add(axesHelper2);


scene.add(spirit2);




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

    spirit1.rotation.x += rotationSpeed1 * deltaTime;
    spirit1.rotation.y += rotationSpeed1 * deltaTime;
}




let aspectRatio = window.innerWidth / (window.innerHeight);

function updatePosition(X, Y){

}

function animate() {
    requestAnimationFrame(animate);
    // Get the time delta in seconds since the last frame
    const deltaTime = clock.getDelta()*10;

    updateSpirit1(deltaTime);
    // Render the scene

    /*
    const direction = new THREE.Vector3();
    camera1.getWorldDirection(direction);
    console.log("Camera 1: ", direction);
    camera2.getWorldDirection(direction);
    console.log("Camera 2: ", direction);
    */

    renderer.render(scene, camera);
}

animate();




function onWindowResize() {
    // Update the size of the renderer
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Add event listener for window resize
window.addEventListener('resize', onWindowResize);