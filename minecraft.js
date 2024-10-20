// Import SimplexNoise for terrain generation (included via CDN in HTML)
const noise = new SimplexNoise();

// Basic setup for Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting setup
const light = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(light);

// Load textures for blocks (replace with the actual paths)
const textureLoader = new THREE.TextureLoader();
const grassTexture = textureLoader.load('textures/grass.jpg');  // Path to grass texture
const dirtTexture = textureLoader.load('textures/dirt.png');    // Path to dirt texture
const stoneTexture = textureLoader.load('textures/stone.png');  // Path to stone texture

// Player object
let player = { height: 1.8, speed: 0.1, turnSpeed: Math.PI * 0.01 };

// Movement tracking
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

// Track key presses
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w': moveForward = true; break;
    case 's': moveBackward = true; break;
    case 'a': moveLeft = true; break;
    case 'd': moveRight = true; break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w': moveForward = false; break;
    case 's': moveBackward = false; break;
    case 'a': moveLeft = false; break;
    case 'd': moveRight = false; break;
  }
});

// Create textured block
function createTexturedBlock(x, y, z, texture) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y, z);
    scene.add(block);
}

// Procedural terrain generation using Simplex Noise
function generateTerrain(width, depth) {
  const scale = 10;  // Adjust scale for terrain roughness

  for (let x = 0; x < width; x++) {
    for (let z = 0; z < depth; z++) {
      const height = Math.floor(noise.noise2D(x / scale, z / scale) * 5);  // Generate height using noise

      // Create stone block for terrain base
      createTexturedBlock(x, height, z, stoneTexture);

      // Add dirt on top of stone
      createTexturedBlock(x, height + 1, z, dirtTexture);

      // Add grass on top of the dirt
      createTexturedBlock(x, height + 2, z, grassTexture);
    }
  }
}

generateTerrain(20, 20);  // Generate a 20x20 terrain

// Raycaster for detecting where to place/remove blocks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Block placement/removal logic
document.addEventListener('click', (event) => {
  // Update mouse coordinates for raycasting
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set up the raycaster based on the camera's position
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const block = intersects[0].object;
    
    // Left-click to remove a block
    scene.remove(block);

    // Shift + click to place a block on top
    if (event.shiftKey) {
      const pos = block.position.clone();
      createTexturedBlock(pos.x, pos.y + 1, pos.z, dirtTexture);  // Add dirt block above the clicked block
    }
  }
});

// Update camera position and controls
camera.position.set(10, player.height, 10);
camera.lookAt(new THREE.Vector3(10, 0, 10));

// Main game loop to update and render the scene
function animate() {
  requestAnimationFrame(animate);

  // Handle player movement with WASD keys
  if (moveForward) camera.position.z -= player.speed;
  if (moveBackward) camera.position.z += player.speed;
  if (moveLeft) camera.position.x -= player.speed;
  if (moveRight) camera.position.x += player.speed;

  renderer.render(scene, camera);
}
animate();
