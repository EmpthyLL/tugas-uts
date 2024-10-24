const BaseController = require("./BaseController");

class LoginController extends BaseController {
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: "Home Page",
      };

      this.renderView(res, options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }
  login() {
    //
  }
}

module.exports = LoginController;
