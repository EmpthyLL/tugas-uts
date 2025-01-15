const { Carts, CartItems } = require("../config/schema");
const userModel = require("./userModel");

class CartModel {
  constructor() {
    this.model = "cart";
  }
  async getCart(id) {
    const cart = await Carts.findOne({
      where: { id },
    });
    return cart;
  }
  async getUserCart(uuid) {
    const user = await userModel.getUserByUUID(uuid);
    const cart = await Carts.findOne({
      where: { user_id: user.id, deleted_at: null },
    });
    return cart;
  }
  async getUserCartList(uuid) {
    const user = await userModel.getUserByUUID(uuid);
    const cart = await Carts.findOne({
      where: { user_id: user.id, deleted_at: null },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: CartItems,
          required: false,
          separate: true,
          order: [["created_at", "DESC"]],
        },
      ],
    });
    return {
      id: cart?.id,
      user_id: cart?.user_id,
      cart_total: cart?.cart_total,
      tax: cart?.tax,
      member_discount: cart?.member_discount,
      delivery: cart?.delivery,
      total: cart?.total,
      created_at: cart?.created_at,
      updated_at: cart?.updated_at,
      deleted_at: cart?.deleted_at,
      items: cart?.CartItems.map((item) => {
        return {
          id: item.item_id,
          title: item.title,
          quantity: item.quantity,
          brand: item.brand,
          category: item.category,
          thumbnail: item.thumbnail,
          price: item.price,
          total: item.total,
        };
      }),
    };
  }
  async getCartItems(cart_id) {
    const items = await CartItems.findAll({
      where: { cart_id },
      order: [["created_at", "DESC"]],
    });
    return items.map((item) => ({
      id: item.id,
      item_id: item.item_id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      brand: item.brand,
      category: item.category,
      thumbnail: item.thumbnail,
      total: item.total,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
  }
  async getCartItem(item_id, uuid) {
    const cart = await this.getUserCart(uuid);
    const item = await CartItems.findOne({
      where: { cart_id: cart.id, item_id },
    });
    return item;
  }
  async createCart(uuid) {
    const user = await userModel.getUserByUUID(uuid);
    await Carts.create({
      user_id: user.id,
      cart_total: 0,
      tax: 0,
      member_discount: 0,
      delivery: 0,
      total: 0,
    });
    const cart = await this.getUserCart(user.uuid);
    return cart.id;
  }
  async addItem(uuid, item) {
    const user = await userModel.getUserByUUID(uuid);
    const { item_id, title, price, brand, category, thumbnail } = item;
    let cart = await this.getUserCart(uuid);
    if (!cart) {
      await this.createCart(uuid);
    }
    await CartItems.create({
      cart_id: cart.id,
      item_id,
      title,
      price: price * 10000,
      brand,
      category,
      thumbnail,
      total: price * 10000,
    });
    cart = await this.getUserCart(uuid);
    await this.updatePrice(cart.id, user.is_member);
  }
  async AddQuantity(itemId, uuid) {
    const user = await userModel.getUserByUUID(uuid);
    const cart = await this.getUserCart(uuid);
    let cartItem = await CartItems.findOne({
      where: { item_id: itemId, cart_id: cart.id },
    });
    cartItem.quantity += 1;
    cartItem.total = cartItem.quantity * cartItem.price;

    await cartItem.save();

    await this.updatePrice(cart.id, user.is_member);
    return cartItem.quantity;
  }
  async ReduceQuantity(itemId, uuid) {
    const user = await userModel.getUserByUUID(uuid);
    const cart = await this.getUserCart(uuid);
    let cartItem = await CartItems.findOne({
      where: { item_id: itemId, cart_id: cart.id },
    });
    cartItem.quantity -= 1;
    if (cartItem.quantity === 0) {
      await cartItem.destroy();
    }
    cartItem.total = cartItem.quantity * cartItem.price;

    await cartItem.save();
    await this.updatePrice(cart.id, user.is_member);
    return cartItem.quantity;
  }
  async updatePrice(cart_id, member) {
    const cart = await this.getCart(cart_id);
    const cartItems = await this.getCartItems(cart_id);
    cart.cart_total = Number(
      cartItems.reduce((acc, item) => acc + Number(item.total), 0).toFixed(2)
    );
    cart.tax = Number((cart.cart_total * 0.11).toFixed(2));
    cart.member_discount = member
      ? Number((cart.cart_total * 0.2).toFixed(2))
      : 0;
    cart.total = Number(
      (
        parseFloat(cart.cart_total) +
        parseFloat(cart.tax) -
        parseFloat(cart.member_discount) +
        parseFloat(cart.delivery)
      ).toFixed(2)
    );
    await cart.save();
  }
  async deleteCart(id) {
    await Carts.update({ deleted_at: new Date() }, { where: { id } });
  }
  async moveItemsToCart(id, items, is_member) {
    const insertArray = items.map((item) => {
      const {
        item_id,
        title,
        price,
        brand,
        category,
        thumbnail,
        total,
        created_at,
        updated_at,
      } = item;
      CartItems.create({
        cart_id: id,
        item_id,
        title,
        price,
        brand,
        category,
        thumbnail,
        total,
        created_at,
        updated_at,
      });
    });
    await Promise.all(insertArray);
    await this.updatePrice(id, is_member);
  }
}

module.exports = new CartModel();
