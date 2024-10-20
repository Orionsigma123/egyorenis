// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Inventory
const inventory = {
    items: [],
    selectedItem: null,
    addItem(item) {
        this.items.push(item);
        this.selectedItem = item; // Select the newly added item
    },
    selectItem(index) {
        if (index < this.items.length) {
            this.selectedItem = this.items[index];
        }
    },
};

// Perlin Noise for Terrain Generation
const simplex = new SimplexNoise();
const generateTerrain = (x, z) => {
    return simplex.noise2D(x / 100, z / 100) * 5; // Adjust height based on noise
};

// Generate world
const generateWorld = () => {
    const worldSize = 100;
    const blockSize = 1;

    for (let x = -worldSize; x < worldSize; x++) {
        for (let z = -worldSize; z < worldSize; z++) {
            const height = generateTerrain(x, z);
            const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Grass color
            const cube = new THREE.Mesh(geometry, material);
            cube.position.set(x, height, z);
            scene.add(cube);
        }
    }
};

generateWorld();

// Camera Position
camera.position.set(0, 20, 30);
camera.lookAt(0, 0, 0);

// Mouse Controls
let isMouseDown = false;
let prevMouseX = 0;
let prevMouseY = 0;

const onMouseDown = (event) => {
    isMouseDown = true;
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
};

const onMouseMove = (event) => {
    if (isMouseDown) {
        const deltaX = event.clientX - prevMouseX;
        const deltaY = event.clientY - prevMouseY;
        camera.rotation.y -= deltaX * 0.005;
        camera.rotation.x -= deltaY * 0.005;
    }
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
};

const onMouseUp = () => {
    isMouseDown = false;
};

// Event Listeners
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', onMouseMove);
window.addEventListener('mouseup', onMouseUp);

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();
