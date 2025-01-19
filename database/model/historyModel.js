const { Histories, Drivers, Carts, CartItems } = require("../config/schema");
const { v4: uuidv4 } = require("uuid");
const cartModel = require("./cartModel");
const userModel = require("./userModel");
const { Op } = require("sequelize");

class HistoryModel {
  constructor() {
    this.model = "history";
    this.status = {
      1: {
        label: "Order Completed",
        description: "The order has been successfully delivered.",
      },
      2: {
        label: "Order Canceled",
        description: "The order was canceled by the user or driver.",
      },
      3: {
        label: "Heading To Mart",
        description: "The driver is heading to the mart.",
      },
      4: {
        label: "Arrived At Mart",
        description: "The driver has arrived at the mart.",
      },
      5: {
        label: "Order Processed",
        description: "The order has been picked and paid for.",
      },
      6: {
        label: "Heading To User",
        description: "The driver is heading to the user.",
      },
      7: {
        label: "Order Arrived",
        description: "The driver has arrived at the user's location.",
      },
    };
  }
  async getHistories(uuid) {
    if (!uuid) {
      return;
    }
    const user = await userModel.getUserByUUID(uuid);
    const histories = await Histories.findAll({
      where: { user_id: user.id },
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
    return histories?.map((history) => ({
      uuid: history?.uuid,
      status: history?.status,
      status_name: this.status[history?.status].label,
      status_des: this.status[history?.status].description,
      rating: history?.rating,
      created_at: history?.created_at,
      driver: {
        name: history?.Driver?.name,
        plat_num: history?.Driver?.plat_num,
      },
      cart: {
        id: history?.Cart?.id,
        user_id: history?.Cart?.user_id,
        cart_total: history?.Cart?.cart_total,
        tax: history?.Cart?.tax,
        member_discount: history?.Cart?.member_discount,
        delivery: history?.Cart?.delivery,
        total: history?.Cart?.total,
        created_at: history?.Cart?.created_at,
        updated_at: history?.Cart?.updated_at,
        deleted_at: history?.Cart?.deleted_at,
        items: history?.Cart?.CartItems?.map((item) => ({
          id: item.item_id,
          title: item.title,
          quantity: item.quantity,
          brand: item.brand,
          category: item.category,
          thumbnail: item.thumbnail,
          price: item.price,
          total: item.total,
        })),
      },
    }));
  }
  async getHistory(id, uuid) {
    if (!uuid) {
      return;
    }
    const user = await userModel.getUserByUUID(uuid);
    const history = await Histories.findOne({
      where: { uuid: id, user_id: user.id },
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
    if (!history) {
      return null;
    }
    return {
      uuid: history?.uuid,
      status: history?.status,
      status_name: this.status[history?.status].label,
      status_des: this.status[history?.status].description,
      rating: history?.rating,
      created_at: history?.created_at,
      driver: {
        name: history?.Driver?.name,
        plat_num: history?.Driver?.plat_num,
      },
      cart: {
        id: history?.Cart?.id,
        user_id: history?.Cart?.user_id,
        cart_total: history?.Cart?.cart_total,
        tax: history?.Cart?.tax,
        member_discount: history?.Cart?.member_discount,
        delivery: history?.Cart?.delivery,
        total: history?.Cart?.total,
        created_at: history?.Cart?.created_at,
        updated_at: history?.Cart?.updated_at,
        deleted_at: history?.Cart?.deleted_at,
        items: history?.Cart?.CartItems?.map((item) => ({
          id: item.item_id,
          title: item.title,
          quantity: item.quantity,
          brand: item.brand,
          category: item.category,
          thumbnail: item.thumbnail,
          price: item.price,
          total: item.total,
        })),
      },
    };
  }
  async createOrder(uuid, delivery, total) {
    if (!uuid) {
      return;
    }
    const user = await userModel.getUserByUUID(uuid);
    let cart = await cartModel.getUserCart(uuid);
    cart.delivery = delivery;
    await cart.save();
    await cartModel.updatePrice(cart.id, user.is_member);
    const driver_id = Math.floor(Math.random() * 70) + 1;
    await Histories.create({
      uuid: uuidv4(),
      user_id: user.id,
      cart_id: cart.id,
      driver_id,
    });
    cart = await cartModel.getCart(cart.id);
    await userModel.purchase(uuid, total);
    await cartModel.deleteCart(cart.id);
  }

  async updateStatus(uuid, status_num, next_status) {
    if (!uuid) {
      return;
    }
    const order = await this.cekOnProccess(uuid);
    order.status = status_num;
    order.next_status = next_status;
    await order.save();
  }
  async cancelOrder(uuid, id) {
    if (!uuid) {
      return;
    }
    const user = await userModel.getUserByUUID(uuid);
    const cart = await cartModel.getCart(user.uuid);
    const order = await Histories.findOne({ where: { uuid: id } });

    if (order.status === 2 || order.status === 1 || order.status === 5) {
      return order.status;
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
    await cartModel.moveItemsToCart(newCartId, orderCartItems, user.is_member);
    await userModel.topup(uuid, orderCart.total);
    await order.save();
  }
  async rateDriver(id, rate, uuid) {
    if (!uuid) {
      return;
    }
    const user = await userModel.getUserByUUID(uuid);
    const history = await Histories.findOne({
      where: { uuid: id, user_id: user.id },
      order: [["created_at", "DESC"]],
    });
    history.rating = rate;
    await history.save();
  }
  async cekOnProccess(uuid) {
    if (!uuid) {
      return;
    }
    const user = await userModel.getUserByUUID(uuid);
    const history = await Histories.findOne({
      where: {
        user_id: user.id,
        status: { [Op.notIn]: [1, 2] },
      },
      order: [["created_at", "DESC"]],
    });
    return history;
  }
}

module.exports = new HistoryModel();
