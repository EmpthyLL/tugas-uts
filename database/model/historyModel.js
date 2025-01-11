const { Histories, Drivers, Carts, CartItems } = require("../config/schema");
const cartModel = require("./cartModel");
const userModel = require("./userModel");

class HistoryModel {
  constructor() {
    this.model = "history";
  }
  async getHistories(uuid) {
    const { id } = await userModel.getUserByUUID(uuid);
    const histories = await Histories.findOne({
      where: { user_id: id },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Carts,
          required: false,
          include: { model: CartItems, required: false },
        },
        {
          model: Drivers,
          required: false,
        },
      ],
    });
    return histories;
  }
  async getHistory(id) {
    const histories = await Histories.findOne({
      where: { id },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Carts,
          required: false,
          include: { model: CartItems, required: false },
        },
        {
          model: Drivers,
          required: false,
        },
      ],
    });
    return histories;
  }
  async createOrder(uuid, cart_id) {
    const { id } = await userModel.getUserByUUID(uuid);
    await cartModel.deleteCart(cart_id);
    const driver_id = Math.floor(Math.random() * 70) + 1;
    await Histories.create({ user_id: id, cart_id, driver_id });
  }
  async updateStatus(id, status_num) {
    const order = await Histories.findOne({ where: { id } });
    order.status = status_num;
    await order.save();
  }
  async cancelOrder(id) {
    const { uuid } = await userModel.getUserByUUID(uuid);
    const cart = await cartModel.getCart(uuid);
    const order = await Histories.findOne({ where: { id } });
    const orderCreatedTime = new Date(order.created_at).getTime();
    const currentTime = Date.now();
    if (currentTime - orderCreatedTime > 5000) {
      return order.created_at;
    }
    order.status = 2;
    const orderCart = await cartModel.getCart(order.cart_id);
    const orderCartItems = await cartModel.getCartItems(orderCart.id);
    let newCartId;
    if (cart) {
      newCartId = cart.id;
    } else {
      const cart_id = await cartModel.createCart(uuid);
      newCartId = cart_id;
    }
    await cartModel.moveItemsToCart(newCartId, orderCartItems);
    await order.save();
  }
  async rateDriver(id, rate) {
    const history = await this.getHistory(id);
    history.rating = rate;
    await history.save();
  }
}

module.exports = new HistoryModel();
