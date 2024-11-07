const Model = require("./Model");

class CartModel extends Model {
  constructor() {
    super("users");
  }

  getUserCart(userId) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");
    return user.cart;
  }

  addItem(userId, newItem) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    const existingItem = user.cart.find((item) => item.id === newItem.id);

    if (existingItem) {
      existingItem.quantity += newItem.quantity || 1;
      if (existingItem.quantity <= 0) {
        user.cart = user.cart.filter((item) => item.id !== newItem.id);
      }
    } else {
      user.cart.push({ ...newItem, quantity: newItem.quantity || 1 });
    }

    this.saveData(this.data);
  }

  decrementItem(userId, itemId) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    const existingItem = user.cart.find((item) => item.id === itemId);

    if (existingItem) {
      existingItem.quantity -= 1;
      if (existingItem.quantity <= 0) {
        user.cart = user.cart.filter((item) => item.id !== itemId);
      }
      this.saveData(this.data);
    } else {
      throw new Error("Item not found in cart.");
    }
  }

  removeItem(userId, itemId) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    user.cart = user.cart.filter((item) => item.id !== itemId);
    this.saveData(this.data);
  }

  getCartItems(userId) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    return user.cart;
  }
}

module.exports = CartModel;
