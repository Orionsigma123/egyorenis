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
let player = { 
  height: 1.8, 
  speed: 0.1, 
  turnSpeed: Math.PI * 0.01, 
  yaw: 0, // Horizontal rotation (left/right)
  pitch: 0, // Vertical rotation (up/down)
  velocityY: 0, // Vertical velocity for gravity and jumping
  isOnGround: false // Track if the player is on the ground
};

const gravity = -0.01; // Gravity force
const jumpVelocity = 0.2; // Jump strength

// Movement tracking
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, jump = false;

// Pointer lock and mouse movement
document.body.addEventListener('click', () => {
  document.body.requestPointerLock();
});

// Track mouse movements for looking around
document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement === document.body) {
    player.yaw -= event.movementX * 0.002; // Left-right rotation
    player.pitch -= event.movementY * 0.002; // Up-down rotation
    player.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, player.pitch)); // Limit pitch to prevent flipping
  }
});

// Track key presses for movement and jumping
document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'w': moveForward = true; break;
    case 's': moveBackward = true; break;
    case 'a': moveLeft = true; break;
    case 'd': moveRight = true; break;
    case ' ': if (player.isOnGround) jump = true; break; // Jump when spacebar is pressed and the player is on the ground
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
const worldBlocks = [];  // Store blocks to check for collisions
function generateTerrain(width, depth) {
  const scale = 10;  // Adjust scale for terrain roughness

  for (let x = 0; x < width; x++) {
    for (let z = 0; z < depth; z++) {
      const height = Math.abs(Math.floor(noise.noise2D(x / scale, z / scale) * 5));  // Ensure height is positive

      // Create stone block for terrain base
      createTexturedBlock(x, height, z, stoneTexture);
      worldBlocks.push({ x, y: height, z });

      // Add dirt on top of stone
      createTexturedBlock(x, height + 1, z, dirtTexture);
      worldBlocks.push({ x, y: height + 1, z });

      // Add grass on top of the dirt
      createTexturedBlock(x, height + 2, z, grassTexture);
      worldBlocks.push({ x, y: height + 2, z });
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

// Check for ground collision (simple AABB collision detection)
function isOnGround(x, y, z) {
  return worldBlocks.some(block => 
    Math.abs(block.x - x) < 0.5 && Math.abs(block.y - (y - 1)) < 0.5 && Math.abs(block.z - z) < 0.5
  );
}

// Main game loop to update and render the scene
function animate() {
  requestAnimationFrame(animate);

  // Handle player movement with WASD keys
  const direction = new THREE.Vector3();

  if (moveForward) direction.z -= player.speed;
  if (moveBackward) direction.z += player.speed;
  if (moveLeft) direction.x -= player.speed;
  if (moveRight) direction.x += player.speed;

  // Rotate direction based on yaw (left-right movement)
  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), player.yaw);
  camera.position.add(direction);

  // Apply gravity and jumping
  if (!player.isOnGround) {
    player.velocityY += gravity;  // Apply gravity when the player is in the air
  }

  if (jump) {
    player.velocityY = jumpVelocity;  // Apply upward velocity for jumping
    jump = false;
  }

  camera.position.y += player.velocityY;  // Move the player vertically

  // Check if the player is on the ground
  player.isOnGround = isOnGround(camera.position.x, camera.position.y, camera.position.z);

  if (player.isOnGround) {
    player.velocityY = 0;  // Stop falling when hitting the ground
    camera.position.y = Math.floor(camera.position.y);  // Snap to block height
  }

  // Update camera rotation based on yaw and pitch
  camera.rotation.set(player.pitch, player.yaw, 0);

  renderer.render(scene, camera);
}
animate();

// Set camera position above terrain, looking downward
camera.position.set(10, 15, 10);  // Set the player's initial position above the terrain
camera.lookAt(new THREE.Vector3(10, 0, 10)); // Look towards the center of the terrain
