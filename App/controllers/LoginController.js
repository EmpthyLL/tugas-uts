const BaseController = require("./BaseController");

class LoginController extends BaseController {
  constructor() {
    super();
    this.view = "login";
    this.layout = "plain";
    this.title = "Login Page";
  }
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
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
