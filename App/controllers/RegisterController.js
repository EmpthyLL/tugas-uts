const UserModel = require("../../model/service/UserModel");
const Controller = require("./Controller");

class RegisterController extends Controller {
  constructor() {
    super();
    this.view = ["input_phone", "verify", "user_data"];
    this.layout = "plain";
    this.title = ["Input Phone", "Verify Number", "User Data"];
    this.no_hp = "";
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
    };
    this.renderView(res, this.view[this.step], options);
  }

  step1(req, res) {
    if (req.path !== "/register/verify-number") {
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
  }

  step2(req, res) {
    if (req.path !== "/register/user-data") {
      this.no_hp = req.body.no_hp;
      res.redirect("/register/user-data");
    }
  }

  async store(req, res) {
    try {
      this.email = req.body.email;
      this.fullname = req.body.fullname;
      const userData = {
        fullname: this.fullname,
        no_hp: this.no_hp,
        email: this.email,
      };

      const { user, token } = await this.model.register(userData);

      req.session.token = token;

      res.redirect(`/sign-in`);
    } catch (error) {
      req.flash("errors", [{ msg: error.message }]);
      res.redirect("/register/user-data");
    }
  }
}

module.exports = RegisterController;
