class World {
    constructor() {
        this.blocks = [];
        this.blockSize = 1;
        this.worldSize = 10; // Size of the generated world
        this.createWorld();
    }

    createWorld() {
        const geometry = new THREE.BoxGeometry(this.blockSize, this.blockSize, this.blockSize);
        const materials = {
            grass: new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/grass.jpg') }),
            dirt: new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/dirt.png') }),
            stone: new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('textures/stone.png') }),
        };

        for (let x = -this.worldSize; x <= this.worldSize; x++) {
            for (let z = -this.worldSize; z <= this.worldSize; z++) {
                const height = Math.floor(Math.random() * 3); // Random height for demo purposes

                for (let y = 0; y <= height; y++) {
                    const blockType = y === height ? 'grass' : (y > 0 ? 'dirt' : 'stone');
                    const block = new THREE.Mesh(geometry, materials[blockType]);
                    block.position.set(x * this.blockSize, y * this.blockSize, z * this.blockSize);
                    this.blocks.push(block);
                }
            }
        }
    }

    addToScene(scene) {
        this.blocks.forEach(block => scene.add(block));
    }

    removeBlock(block) {
        const index = this.blocks.indexOf(block);
        if (index > -1) {
            this.blocks.splice(index, 1);
            block.geometry.dispose();
            block.material.dispose();
            block.removeFromParent();
        }
    }
}
