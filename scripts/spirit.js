import * as THREE from './three.module.js';

const scene = new THREE.Scene();

const cage = document.getElementById("cage");

console.log(cage.clientWidth)
console.log(cage.clientHeight)
var camera = new THREE.PerspectiveCamera(75, cage.clientWidth / cage.clientHeight);
camera.position.z = 5;
camera.lookAt(0, 0, 0);

var renderer = new THREE.WebGLRenderer({ alpha: false });

renderer.setClearColor(0x000000, 0); // Transparent background
renderer.setSize(cage.clientWidth, cage.clientHeight);
cage.appendChild(renderer.domElement);


var spirit = new THREE.Group();

var axesHelper = new THREE.AxesHelper(10); // Length of the axes
scene.add(axesHelper);

function animate() {
    requestAnimationFrame(animate);
    // Get the time delta in seconds since the last frame
    const clock = new THREE.Clock();
    const deltaTime = clock.getDelta()*69;
    //console.log(deltaTime);
    renderer.render(scene, camera);
}

animate();