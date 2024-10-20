const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const tileSize = 1;
const inventory = []; // Array to store items in the inventory
let selectedItem = null; // Currently selected item for placing blocks
const chunks = {}; // Store generated chunks

// Function to create a cube (block)
function createBlock(color) {
    const geometry = new THREE.BoxGeometry(tileSize, tileSize, tileSize);
    const material = new THREE.MeshBasicMaterial({ color: color });
    return new THREE.Mesh(geometry, material);
}

// Function to generate a chunk of blocks
function generateChunk(chunkX, chunkY) {
    const chunk = new THREE.Group();
    for (let x = 0; x < 16; x++) {
        for (let z = 0; z < 16; z++) {
            const height = Math.floor(Math.random() * 5);
            for (let y = 0; y < height; y++) {
                const block = createBlock(y === height - 1 ? 0x00FF00 : 0x8B4513); // Grass or dirt
                block.position.set(x + chunkX * 16, y, z + chunkY * 16);
                chunk.add(block);
            }
        }
    }
    return chunk;
}

// Function to load chunks
function loadChunks() {
    for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
            const chunkKey = `${x},${z}`;
            if (!chunks[chunkKey]) {
                const chunk = generateChunk(x, z);
                scene.add(chunk);
                chunks[chunkKey] = chunk;
            }
        }
    }
}

// Function to add block to inventory
function addBlockToInventory(type) {
    inventory.push(type);
    updateInventoryDisplay();
}

// Update inventory display
function updateInventoryDisplay() {
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = '';
    inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = item;
        itemDiv.addEventListener('click', () => {
            selectedItem = item;
        });
        itemsDiv.appendChild(itemDiv);
    });
}

// Place block function
function placeBlock(x, y, z) {
    if (selectedItem) {
        const blockColor = selectedItem === 'grass' ? 0x00FF00 : 0x8B4513; // Grass or dirt
        const block = createBlock(blockColor);
        block.position.set(Math.floor(x), Math.floor(y), Math.floor(z));
        scene.add(block);
    }
}

// Mouse controls
let isPlacing = false;
window.addEventListener('mousedown', () => { isPlacing = true; });
window.addEventListener('mouseup', () => { isPlacing = false; });

window.addEventListener('click', (event) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0 && isPlacing) {
        const { point } = intersects[0];
        placeBlock(point.x, point.y, point.z);
    }
});

// Set camera position
camera.position.set(8, 5, 8);
camera.lookAt(0, 0, 0);

// Load initial chunks
loadChunks();

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
