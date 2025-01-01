const Controller = require("./Controller");

class AboutController extends Controller {
  constructor() {
    super();
    this.view = "index/about";
    this.layout = "layout";
    this.title = "About Us";
  }
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        cart: this.user.cart,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render about page", 500);
    }
  }
}

module.exports = AboutController;
