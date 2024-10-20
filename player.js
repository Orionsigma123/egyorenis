class Player {
    constructor(camera) {
        this.camera = camera;
        this.position = new THREE.Vector3(0, 10, 0); // Starting position
        this.speed = 0.1;
    }

    update(keyboardState) {
        const direction = new THREE.Vector3();
        if (keyboardState['KeyW']) direction.z -= 1; // Move forward
        if (keyboardState['KeyS']) direction.z += 1; // Move backward
        if (keyboardState['KeyA']) direction.x -= 1; // Move left
        if (keyboardState['KeyD']) direction.x += 1; // Move right

        direction.normalize().multiplyScalar(this.speed);
        this.position.add(direction);
        this.camera.position.set(this.position.x, this.position.y, this.position.z);
        this.camera.lookAt(this.position.x, this.position.y, this.position.z - 1); // Look direction
    }
}
