const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 32; // Size of each block
const inventory = []; // Array to store items in the inventory
let selectedItem = null; // Current selected item for placing blocks

// Function to generate a chunk of the world
function generateChunk(x, y) {
    const chunk = [];
    for (let i = 0; i < 16; i++) {
        const column = [];
        for (let j = 0; j < 16; j++) {
            if (j < 5) {
                column.push('grass'); // Top layer
            } else {
                column.push('dirt'); // Below grass
            }
        }
        chunk.push(column);
    }
    return chunk;
}

// Load the initial world
let world = {};
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        world[`${i},${j}`] = generateChunk(i, j);
    }
}

// Function to draw the world
function drawWorld() {
    for (const [key, chunk] of Object.entries(world)) {
        const [x, y] = key.split(',').map(Number);
        for (let i = 0; i < chunk.length; i++) {
            for (let j = 0; j < chunk[i].length; j++) {
                const tile = chunk[i][j];
                ctx.fillStyle = tile === 'grass' ? 'green' : 'brown';
                ctx.fillRect(x * 16 * tileSize + i * tileSize, y * 16 * tileSize + j * tileSize, tileSize, tileSize);
            }
        }
    }
}

// Function to add block to inventory
function addBlockToInventory(type) {
    inventory.push(type);
    updateInventoryDisplay();
}

// Update the inventory display
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

// Function to place block
function placeBlock(x, y) {
    if (selectedItem) {
        // Logic to place block in the world
        const chunkX = Math.floor(x / (16 * tileSize));
        const chunkY = Math.floor(y / (16 * tileSize));
        const tileX = (x % (16 * tileSize)) / tileSize;
        const tileY = (y % (16 * tileSize)) / tileSize;

        if (world[`${chunkX},${chunkY}`]) {
            world[`${chunkX},${chunkY}`][tileY][tileX] = selectedItem; // Place the block
            drawWorld(); // Redraw the world
        }
    }
}

// Mouse events to handle placing blocks
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    placeBlock(x, y);
});

// Initial draw
drawWorld();
