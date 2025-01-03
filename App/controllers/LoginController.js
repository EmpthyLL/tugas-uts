const userModel = require("../../database/model/userModel");
const { setCookie, removeCookie } = require("../../utils/cookie");
const Controller = require("./Controller");

class LoginController extends Controller {
  constructor() {
    super();
    this.view = ["auth/login", "auth/verify"];
    this.layout = "plain";
    this.title = ["Input Phone", "Verify Account"];
    this.no_hp = "";
    this.step = 0;
    this.isEmail = false;
  }
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title[this.step],
        errors: req.flash("errors") || [],
        no_hp: this.no_hp,
        login: true,
        isAuth: true,
        isEmail: this.isEmail,
      };
      this.renderView(res, this.view[this.step], options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render register page", 500);
    }
  }
  login(req, res) {
    this.no_hp = req.body.no_hp;
    try {
      if (!this.model.findUserByPhone(this.no_hp)) {
        throw new Error("Phone number is not yet registered.");
      }
      res.redirect("/sign-in/verify-account");
    } catch (error) {
      req.flash("errors", [{ msg: error.message }]);
      res.redirect("/sign-in");
    }
  }
  async verify(req, res) {
    try {
      this.no_hp = req.body.no_hp;
      const token = await this.model.login(this.no_hp);

      setCookie(res, "auth_token", token);
      res.redirect("/");
    } catch (error) {
      console.log(error);
      req.flash("errors", [{ msg: error.message }]);
      res.redirect("/sign-in/verify-account");
    }
  }
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("/");
      }

      res.redirect("/");
    });
  }
}

module.exports = LoginController;
