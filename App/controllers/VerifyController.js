const Controller = require("./Controller")

class VerifyController extends Controller {
  constructor() {
    super();
    this.view = "verify";
    this.layout = "plain";
    this.title = "Verify OTP";
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

module.exports = VerifyController;