class Controls {
    constructor() {
        this.keyboardState = {};
        this.mouseDown = false;
        this.prevMouseX = 0;
        this.prevMouseY = 0;

        window.addEventListener('keydown', (event) => {
            this.keyboardState[event.code] = true;
        });
        window.addEventListener('keyup', (event) => {
            this.keyboardState[event.code] = false;
        });

        window.addEventListener('mousedown', (event) => {
            this.mouseDown = true;
            this.prevMouseX = event.clientX;
            this.prevMouseY = event.clientY;
        });
        window.addEventListener('mouseup', () => {
            this.mouseDown = false;
        });

        window.addEventListener('mousemove', (event) => {
            if (this.mouseDown) {
                const deltaX = event.clientX - this.prevMouseX;
                const deltaY = event.clientY - this.prevMouseY;
                camera.rotation.y -= deltaX * 0.002; // Adjust rotation sensitivity
                camera.rotation.x -= deltaY * 0.002;
            }
            this.prevMouseX = event.clientX;
            this.prevMouseY = event.clientY;
        });
    }
}
