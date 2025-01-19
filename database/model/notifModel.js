const { Notifications } = require("../config/schema");
const userModel = require("./userModel");

class NotifModel {
  constructor() {
    this.model = "notif";
  }
  async getNotif(uuid) {
    if (!uuid) {
      return;
    }
    const user = await userModel.getUserByUUID(uuid);
    const notifs = await Notifications.findAll({
      where: { user_id: user.id },
      order: [["created_at", "DESC"]],
    });
    return notifs;
  }
  async getNotifCategory(uuid, category) {
    if (!uuid) {
      return;
    }
    const user = await userModel.getUserByUUID(uuid);
    const notifs = await Notifications.findAll({
      where: { user_id: user.id, category },
      order: [["created_at", "DESC"]],
    });
    return notifs;
  }
  async addNotif(uuid, message) {
    if (!uuid) {
      return;
    }
    const user = await userModel.getUserByUUID(uuid);
    await Notifications.create({ user_id: user.id, ...message });
  }
  async markAsRead(id) {
    const notif = await Notifications.findByPk(id);
    notif.is_read = true;
    await notif.save();
  }
}

module.exports = new NotifModel();
