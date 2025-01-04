const Controller = require("./Controller");

class NotifController extends Controller {
  constructor() {
    super();
    this.view = "notification/notifList";
    this.layout = "layout";
    this.title = "Notification";
    this.user = {};
  }
  async index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        keyword: "",
        user: this.user,
        cart: this.user.cart,
      };
      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render notification page", 500);
    }
  }
}

module.exports = NotifController;
