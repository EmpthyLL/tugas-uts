const UserModel = require("../../model/service/UserModel");
const Controller = require("./Controller");

const { validationResult } = require("express-validator");

class RegisterController extends Controller {
  constructor() {
    super();
    this.view = "register";
    this.layout = "plain";
    this.title = "Register Page";
  }

  index(req, res) {
    const options = {
      layout: `components/${this.layout}`,
      title: this.title,
      errors: req.flash("errors") || [],
    };
    this.renderView(res, options);
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

      res.redirect("/sign-in");
    } catch (error) {
      // req.flash("errors", [{ msg: "Failed to register. Try again." }]);
      req.flash("errors", [{ msg: error.message }]);
      res.redirect("/register");
    }
  }
}

module.exports = RegisterController;
