const { Notifications } = require("../config/schema");
const userModel = require("./userModel");

class NotifModel {
  constructor() {
    this.model = "notif";
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
}

module.exports = new NotifModel();
