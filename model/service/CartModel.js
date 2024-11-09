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

    // Initialize the cart if it doesn't exist
    if (!user.cart) {
      user.cart = {
        items: [],
        cart_total: 0,
        tax: 0,
        member_discount: 0,
        delivery: 0,
        total: 0,
      };
    }

    const existingItem = user.cart.items.find((item) => item.id === newItem.id);

    if (existingItem) {
      // Update quantity and total if item already exists in the cart
      existingItem.quantity += newItem.quantity || 1;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      user.cart.items.unshift({
        ...newItem,
        quantity: newItem.quantity || 1,
        total: newItem.price * (newItem.quantity || 1),
      });
    }

    // Recalculate the cart total, tax, member discount, and delivery
    this.updateCartTotals(user.cart);

    this.saveData(this.data);
  }

  incrementItem(userId, itemId) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    const existingItem = user.cart.items.find((item) => item.id === itemId);
    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.total = existingItem.price * existingItem.quantity;

      // Recalculate the cart total, tax, member discount, and delivery
      this.updateCartTotals(user.cart);

      this.saveData(this.data);
      return existingItem.quantity;
    } else {
      throw new Error("Item not found in cart.");
    }
  }

  decrementItem(userId, itemId) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    const existingItem = user.cart.items.find((item) => item.id === itemId);
    if (existingItem) {
      existingItem.quantity -= 1;
      existingItem.total = existingItem.price * existingItem.quantity;

      if (existingItem.quantity <= 0) {
        user.cart.items = user.cart.items.filter((item) => item.id !== itemId);
      }

      // Recalculate the cart total, tax, member discount, and delivery
      this.updateCartTotals(user.cart);

      this.saveData(this.data);
      return existingItem.quantity;
    } else {
      throw new Error("Item not found in cart.");
    }
  }

  removeItem(userId, itemId) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    user.cart.items = user.cart.items.filter((item) => item.id !== itemId);

    // Recalculate the cart total, tax, member discount, and delivery
    this.updateCartTotals(user.cart);

    this.saveData(this.data);
  }

  getCartItems(userId) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    return user.cart.items;
  }

  updateCartTotals(cart) {
    cart.cart_total = cart.items.reduce((acc, item) => acc + item.total, 0);

    cart.tax = cart.cart_total * 0.11;
    cart.member_discount = cart.cart_total * 0.2;
    cart.delivery = 2500 * Math.random();

    cart.total =
      cart.cart_total + cart.tax - cart.member_discount + cart.delivery;
  }
}

module.exports = CartModel;
