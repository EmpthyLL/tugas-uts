const { Notifications } = require("../config/schema");
const userModel = require("./userModel");

const notifModel = {
  async getNotif(uuid) {
    const { id } = await userModel.getUserByUUID(uuid);
    const notifs = await Notifications.findAll({ where: { user_id: id } });
    return notifs || [];
  },
  async addNotif(uuid, message, type) {
    const { id } = await userModel.getUserByUUID(uuid);
    await Notifications.create({ user_id: id, ...message, type });
  },
  async markAsRead(id) {
    const notif = await Notifications.findByPk(id);
    notif.is_read = true;
    await notif.save();
  },
  async cekUnread(uuid) {
    const { id } = await userModel.getUserByUUID(uuid);
    const notifs = await Notifications.findAll({
      where: { user_id: id, is_read: false },
    });
    return notifs.length > 0 || 0;
  },
};

module.exports = notifModel;
