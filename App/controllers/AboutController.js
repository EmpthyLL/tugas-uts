const BaseController = require("./BaseController");

class AboutController extends BaseController {
  constructor() {
    super();
    this.view = "about";
    this.layout = "layout";
    this.title = "About Us";
  }
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
      };

      this.renderView(res, options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }
}

module.exports = AboutController;
