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

camera.position.set(0, 5, 10); // Set initial camera position

const animate = () => {
    requestAnimationFrame(animate);
    player.update(controls.keyboardState);
    renderer.render(scene, camera);
};

// Block breaking and placing
window.addEventListener('click', () => {
    const selectedBlock = world.blocks.find(block => {
        const distance = block.position.distanceTo(camera.position);
        return distance < 2; // Adjust based on your needs
    });

    if (selectedBlock) {
        world.removeBlock(selectedBlock); // Break block
    } else {
        const selectedItem = inventory.getSelectedItem();
        // Place block logic here
    }
});

animate();
