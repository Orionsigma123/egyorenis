const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new Controls();
const inventory = new Inventory();
const player = new Player(camera);
const world = new World();
world.addToScene(scene);
const ui = new UI(inventory);

// Load previous game state if available
GameState.loadWorld(world);

camera.position.set(0, 5, 10);

const animate = () => {
    requestAnimationFrame(animate);
    player.update(controls.keyboardState);
    renderer.render(scene, camera);
};

// Block breaking and placing
window.addEventListener('click', () => {
    const selectedBlock = world.blocks.find(block => {
        const distance = block.position.distanceTo(camera.position);
        return distance < 2; // Adjust distance based on your needs
    });

    if (selectedBlock) {
        world.removeBlock(selectedBlock); // Break block
    } else {
        const selectedItem = inventory.getSelectedItem();
        const position = new THREE.Vector3();
        const block = world.createBlock(selectedItem, camera.position.clone().add(camera.getWorldDirection(position).multiplyScalar(2)));
        world.blocks.push(block);
        scene.add(block); // Place block
    }
});

// Save the game state every few seconds (for demonstration, you might want to trigger this by a key press)
setInterval(() => {
    GameState.saveWorld(world);
}, 10000); // Save every 10 seconds

animate();
