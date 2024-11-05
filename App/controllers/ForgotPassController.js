const Controller = require("./Controller");

class ForgotPassController extends Controller {
  constructor() {
    super();
    this.view = "forgotpass";
    this.layout = "plain";
    this.title = "Forgot Password";
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
  sendOTP() {
    //
  }
}

module.exports = ForgotPassController;