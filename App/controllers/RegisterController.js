const UserModel = require("../../model/service/UserModel");
const Controller = require("./Controller");
const cookie = require("cookie");

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

      const { user, token } = await this.model.register({
        fullname: this.fullname,
        no_hp: this.no_hp,
        email: this.email,
      });

      res.setHeader(
        "Set-Cookie",
        cookie.serialize("token", token, {
          httpOnly: true,
          maxAge: 60 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
        })
      );

      req.session.userId = user.uuid;

      res.redirect(`/`);
    } catch (error) {
      req.flash("errors", [{ msg: error.message }]);
      res.redirect("/register/user-data");
    }
  }
}

module.exports = RegisterController;
