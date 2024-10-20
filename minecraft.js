// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Generate a simple block (cube)
function createBlock(x, y, z) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });  // Green for grass
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y, z);
    scene.add(block);
}

// Generate a flat world made of blocks
function generateWorld(width, depth) {
    for (let x = 0; x < width; x++) {
        for (let z = 0; z < depth; z++) {
            createBlock(x, 0, z);  // Placing all blocks at y = 0
        }
    }
}

generateWorld(10, 10);

// Camera setup
camera.position.set(5, 5, 10);
camera.lookAt(5, 0, 5);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
