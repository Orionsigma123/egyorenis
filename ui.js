class UI {
    constructor(inventory) {
        this.inventory = inventory;
        this.selectedItemElement = document.querySelector('#selected-item span');
        this.inventoryItemsElement = document.querySelector('#inventory-items');
        this.updateUI();
    }

    updateUI() {
        this.selectedItemElement.textContent = this.inventory.getSelectedItem();

        // Clear previous items
        this.inventoryItemsElement.innerHTML = '';

        this.inventory.items.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('inventory-item');
            itemDiv.style.backgroundImage = `url(textures/${item}.png)`; // Assuming texture file names match item names
            itemDiv.addEventListener('click', () => {
                this.inventory.selectItem(index);
                this.updateUI();
            });
            this.inventoryItemsElement.appendChild(itemDiv);
        });
    }
}
