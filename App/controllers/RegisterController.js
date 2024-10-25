const BaseController = require("./BaseController");

class RegisterController extends BaseController {
  constructor() {
    super();
    this.view = "login";
    this.layout = "plain";
    this.title = "Register Page";
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
  store() {
    //
  }
}

module.exports = RegisterController;
