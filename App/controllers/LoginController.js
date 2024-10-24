const BaseController = require("./BaseController");

class LoginController extends BaseController {
  index(req, res) {
    try {
      const options = {
        title: "Home Page",
      };

      this.renderView(res, "login", options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }
  login() {
    //
  }
}

module.exports = LoginController;
