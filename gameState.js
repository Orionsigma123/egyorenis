class GameState {
    static saveWorld(world) {
        const savedBlocks = world.blocks.map(block => ({
            position: block.position.toArray(),
            type: block.material.map.image.src.split('/').pop().split('.')[0], // Get block type from texture
        }));

        localStorage.setItem('savedWorld', JSON.stringify(savedBlocks));
    }

    static loadWorld(world) {
        const savedWorld = JSON.parse(localStorage.getItem('savedWorld'));

        if (savedWorld) {
            world.blocks.forEach(block => {
                block.geometry.dispose();
                block.material.dispose();
                block.removeFromParent();
            });

            world.blocks = []; // Clear current blocks

            savedWorld.forEach(savedBlock => {
                const blockType = savedBlock.type;
                const block = world.createBlock(blockType, new THREE.Vector3(...savedBlock.position));
                world.blocks.push(block);
            });
        }
    }
}
