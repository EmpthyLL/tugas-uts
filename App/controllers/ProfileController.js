const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");

class ProfileController extends Controller {
  constructor() {
    super();
    this.view = "profile";
    this.layout = "layout";
    this.title = "";
    this.user = {};
  }
  index(req, res) {
    try {
      this.user = getAuthUser(req);
      this.title = this.user.fullname + " - Profile";
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        keyword: "",
        user: this.user,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render profile page", 500);
    }
  }
}

module.exports = ProfileController;
