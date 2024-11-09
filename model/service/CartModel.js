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
    this.updateCartTotals(user.member, user.cart);

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
      this.updateCartTotals(user.member, user.cart);

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
      this.updateCartTotals(user.member, user.cart);

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
    this.updateCartTotals(user.member, user.cart);

    this.saveData(this.data);
  }

  getCartItems(userId) {
    const user = this.data.find((user) => user.uuid === userId);
    if (!user) throw new Error("User not found.");

    return user.cart.items;
  }

  updateCartTotals(member, cart) {
    cart.cart_total = Number(
      (cart.items.reduce((acc, item) => acc + item.total, 0) * 15000).toFixed(2)
    );

    cart.tax = Number((cart.cart_total * 0.11).toFixed(2));

    cart.member_discount = member
      ? Number((cart.cart_total * 0.2).toFixed(2))
      : 0;

    cart.delivery = Number((2500 * Math.ceil(Math.random() * 100)).toFixed(2));

    cart.total = Number(
      (
        parseFloat(cart.cart_total) +
        parseFloat(cart.tax) -
        parseFloat(cart.member_discount) +
        parseFloat(cart.delivery)
      ).toFixed(2)
    );
  }
}

module.exports = CartModel;
