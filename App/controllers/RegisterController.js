const UserModel = require("../../model/service/UserModel");
const Controller = require("./Controller");

class RegisterController extends Controller {
  constructor() {
    super();
    this.view = ["input_phone", "verify", "user_data"];
    this.layout = "plain";
    this.title = ["Input Phone", "Verify Number", "User Data"];
    this.no_hp = "";
    this.step = 0;
  }

  index(req, res) {
    const options = {
      layout: `components/${this.layout}`,
      title: this.title[this.step],
      errors: req.flash("errors") || [],
      no_hp: this.no_hp,
    };
    console.log(this.step);
    console.log(this.no_hp);
    console.log(req.path);
    this.renderView(res, this.view[this.step], options);
  }

  step1(req, res) {
    if (req.path !== "/register/verify-number") {
      this.no_hp = req.body.no_hp;
      res.redirect("/register/verify-number");
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
      const userData = {
        fullname: req.body.fullname,
        no_hp: req.body.no_hp,
        email: req.body.email,
        password: req.body.password,
      };

      const user = new UserModel();
      await user.register(userData);

      // Redirect with no_hp as a query parameter
      res.redirect(`/sign-in`);
    } catch (error) {
      req.flash("errors", [{ msg: "Failed to register. Try again." }]);
      res.redirect("/register/user-data");
    }
  }
}

module.exports = RegisterController;
