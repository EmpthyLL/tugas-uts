const Controller = require("./Controller");

class AddToCart extends Controller {
  constructor() {
    super();
    this.view = "about";
    this.layout = "layout";
    this.title = "Add To Cart";
  }
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        keyword,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render about page", 500);
    }
  }
}

module.exports = AddToCart;
