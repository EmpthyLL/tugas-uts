const notifModel = require("../../database/model/notifModel");
const Controller = require("./Controller");

class NotifController extends Controller {
  constructor() {
    super();
    this.view = "notification/notification";
    this.layout = "layout";
    this.title = "Notification";
    this.user = {};
  }
  async index(req, res) {
    try {
      const data = await notifModel.getNotifCategory(
        req.cookies.userId,
        "common"
      );
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        data,
      };
      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render notification page", 500);
    }
  }

  async getAll(req, res) {
    try {
      const notifs = await notifModel.getNotif(req.cookies.userId);
      res.status(200).json({
        message: "Notifications retrieved successfully!",
        data: notifs,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve common notifications.",
        error: error.message,
      });
    }
  }
  async getCategory(req, res) {
    try {
      const notifs = await notifModel.getNotifCategory(
        req.cookies.userId,
        req.params.category
      );
      res.status(200).json({
        message: "Notifications retrieved successfully!",
        data: notifs,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve common notifications.",
        error: error.message,
      });
    }
  }
  async markAsRead(req, res) {
    try {
      await notifModel.markAsRead(req.params.id);
      res.status(200).json({
        message: "Notification has been read!",
        data: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve common notifications.",
        error: error.message,
      });
    }
  }
}

module.exports = NotifController;
