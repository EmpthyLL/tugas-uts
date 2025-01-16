const { Notifications } = require("../config/schema");
const userModel = require("./userModel");

class NotifModel {
  constructor() {
    this.model = "notif";
    this.status = {
      1: {
        title: "Hello welcome!",
        body: "Let's get started.",
        type: "common",
      },
      2: {
        title: "Become a member!",
        body: "Enjoy exclusive benefits.",
        type: "common",
      },
      3: {
        title: "Top-up successful!",
        body: "Your balance has been updated.",
        type: "payment",
      },
      4: {
        title: "Order confirmed!",
        body: "We're processing it now.",
        type: "order",
      },
      5: {
        title: "Order Canceled!",
        body: "Contact us for any questions.",
        type: "order",
      },
      6: {
        title: "Order completed!",
        body: "Thank you for your purchase.",
        type: "order",
      },
      7: {
        title: "On the way!",
        body: "Your order is heading to the market.",
        type: "order",
      },
      8: {
        title: "On the way!",
        body: "Your order has arrived at the market.",
        type: "order",
      },
      9: {
        title: "On the way!",
        body: "Your order is on its way to you, almost there!",
        type: "order",
      },
      10: {
        title: "Arrived!",
        body: "Your order has arrived.",
        type: "order",
      },
      11: {
        title: "Change profile Completed!",
        body: "Your profile has been change.",
        type: "common",
      },
      12: {
        title: "Change email completed!",
        body: "Your email has been change.",
        type: "common",
      },
      13: {
        title: "Change number completed!",
        body: "Your number has been change.",
        type: "common",
      },
      14: {
        title: "Change profile data",
        body: "Your profile data has been change.",
        type: "common",
      },
    };
  }
  async getNotif(uuid) {
    const user = await userModel.getUserByUUID(uuid);
    const notifs = await Notifications.findAll({
      where: { user_id: user.id },
      order: [["created_at", "DESC"]],
    });
    return notifs;
  }
  async addNotif(uuid, message, type) {
    const user = await userModel.getUserByUUID(uuid);
    await Notifications.create({ user_id: user.id, ...message, type });
  }
  async markAsRead(id) {
    const notif = await Notifications.findByPk(id);
    notif.is_read = true;
    await notif.save();
  }
  async cekUnread(uuid) {
    const user = await userModel.getUserByUUID(uuid);
    const notifs = await Notifications.findAll({
      where: { user_id: user.id, is_read: false },
    });
    return notifs.length > 0 || 0;
  }
  async getAllStatuses() {
    return Object.entries(this.status).map(([id, data]) => ({
      id: parseInt(id, 10),
      ...data,
    }));
  }
}

module.exports = new NotifModel();
