const UserModel = require("../../model/service/UserModel");
const { setCookie } = require("../../utils/cookie");
const Controller = require("./Controller");

class RegisterController extends Controller {
  constructor() {
    super();
    this.view = ["input_phone", "verify", "user_data"];
    this.layout = "plain";
    this.title = ["Input Phone", "Verify Number", "User Data"];
    this.no_hp = "";
    this.email = "";
    this.nama = "";
    this.step = 0;
    this.model = new UserModel();
  }

  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title[this.step],
        errors: req.flash("errors") || [],
        no_hp: this.no_hp,
        fullname: this.fullname,
        email: this.email,
        login: false,
      };
      this.renderView(res, this.view[this.step], options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render register page", 500);
    }
  }

  step1(req, res) {
    this.no_hp = req.body.no_hp;
    try {
      if (!this.model.isPhoneUnique(this.no_hp)) {
        throw new Error("Phone number is already registered.");
      }
      res.redirect("/register/verify-number");
    } catch (error) {
      req.flash("errors", [{ msg: error.message }]);
      res.redirect("/register");
    }
  }

  step2(req, res) {
    this.no_hp = req.body.no_hp;
    res.redirect("/register/user-data");
  }

  async store(req, res) {
    try {
      this.email = req.body.email;
      this.fullname = req.body.fullname;
      this.no_hp = req.body.no_hp;

      const token = await this.model.register({
        fullname: this.fullname,
        no_hp: this.no_hp,
        email: this.email,
      });

      setCookie(res, "auth_token", token);

      res.redirect(`/`);
    } catch (error) {
      req.flash("errors", [{ msg: error.message }]);
      res.redirect("/register/user-data");
    }
  }
}

module.exports = RegisterController;
