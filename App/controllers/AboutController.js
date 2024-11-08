const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");

class AboutController extends Controller {
  constructor() {
    super();
    this.view = "about";
    this.layout = "layout";
    this.title = "About Us";
    this.user = {};
  }
  index(req, res) {
    try {
      this.user = getAuthUser(req, res, false);
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        user: this.user,
        cart: this.user.cart,
        keyword: "",
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render about page", 500);
    }
  }
}

module.exports = AboutController;
