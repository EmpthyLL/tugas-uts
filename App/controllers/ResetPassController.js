const Controller = require("./Controller");

class ResetPassController extends Controller {
  constructor() {
    super();
    this.view = "resetpass";
    this.layout = "plain";
    this.title = "Reset Password";
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

module.exports = ResetPassController;