const BaseController = require("./BaseController");

class HomeController extends BaseController {
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: "Home Page",
        req,
        menus: this.menus,
      };

      this.renderView(res, options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }
}

module.exports = HomeController;
