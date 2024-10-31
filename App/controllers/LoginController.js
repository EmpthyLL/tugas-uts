const UserModel = require("../../model/service/UserModel");
const Controller = require("./Controller");

class LoginController extends Controller {
  constructor() {
    super();
    this.view = ["login", "verify"];
    this.layout = "plain";
    this.title = ["Input Phone", "Verify Account"];
    this.no_hp = "";
    this.step = 0;
    this.model = new UserModel();
  }
  index(req, res) {
    const options = {
      layout: `components/${this.layout}`,
      title: this.title[this.step],
      errors: req.flash("errors") || [],
      no_hp: this.no_hp,
      login: true,
    };
    this.renderView(res, this.view[this.step], options);
  }
  login() {
    //
  }
  verify() {
    //
  }
}

module.exports = LoginController;
