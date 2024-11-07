const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");

class TopupController extends Controller {
  constructor() {
    super();
    this.view = "topup";
    this.layout = "layout";
    this.title = "Top Up";
    this.user = {};
  }

  index(req, res) {
    try {
      this.user = getAuthUser(req);
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        keyword: "",
        user: this.user,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.error("Error rendering top up page:", error);
      this.handleError(res, "Failed to render top up page", 500);
    }
  }
}

module.exports = TopupController;
