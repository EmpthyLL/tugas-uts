const Model = require("./Model");

class CartModel extends Model {
  getCartItems() {
    return this.data;
  }

  addItem(item) {
    this.data.push(item);
    this.saveData(this.data);
  }

  editItem(itemId, updatedItem) {
    const itemIndex = this.data.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) throw new Error("Item not found.");

    this.data[itemIndex] = { ...this.data[itemIndex], ...updatedItem };
    this.saveData(this.data);
  }

  removeItem(itemId) {
    this.data = this.data.filter((item) => item.id !== itemId);
    this.saveData(this.data);
  }
}

module.exports = CartModel;
