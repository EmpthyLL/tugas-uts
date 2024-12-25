const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");
const formatDate = require("../../utils/formateDate");

class AboutController extends Controller {
  constructor() {
    super();
    this.view = "index/about";
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
        formatDate,
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
