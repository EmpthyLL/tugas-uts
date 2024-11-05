const UserModel = require("../../model/service/UserModel");
const Controller = require("./Controller");
const SECRET_KEY = "T0l0NGj4g4Rahasia";

class ProfileController extends Controller {
  constructor() {
    super();
    this.view = "profile";
    this.layout = "layout";
    this.title = "About Us";
    this.model = new UserModel();
  }
  index(req, res) {
    try {
      const token = req.cookies.auth_token;
      let user = "";
      if (token) {
        const { userId } = jwt.verify(token, SECRET_KEY);
        user = this.model.getUserByUuid(userId);
      }
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        keyword: "",
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render home page", 500);
    }
  }
}

module.exports = ProfileController;
