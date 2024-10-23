const BaseController = require("./BaseController");

class HomeController extends BaseController {
  constructor() {
    super();
  }
  index(req, res) {
    try {
      const options = {
        layout: "components/layout",
        title: "Home Page",
      };

      this.renderView(res, "index", options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }
}

module.exports = HomeController;
