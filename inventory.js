class Inventory {
    constructor() {
        this.items = ['grass', 'dirt', 'stone']; // Sample items
        this.selectedItemIndex = 0; // Default selected item
    }

    selectItem(index) {
        this.selectedItemIndex = index % this.items.length;
    }

    getSelectedItem() {
        return this.items[this.selectedItemIndex];
    }
}
