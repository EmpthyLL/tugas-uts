const formatDate = require("../../utils/formateDate");
const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");

class History extends Controller {
  constructor() {
    super();
    this.view = "history";
    this.layout = "layout";
    this.title = "Order History";
    this.user = {};
  }
  index(req, res) {
    try {
      this.user = getAuthUser(req, res, false);
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        formatDate,
        keyword,
        user: this.user,
        cart: this.user.cart,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render about page", 500);
    }
  }
}

module.exports = History;
