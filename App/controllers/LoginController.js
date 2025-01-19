const notifModel = require("../../database/model/notifModel");
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
        req,
        isAuth: true,
        isEmail: this.isEmail,
      };
      this.renderView(res, this.view[this.step], options);
    } catch (error) {
      this.handleError(res, "Failed to render register page", 500);
    }
  }
  async login(req, res) {
    this.no_hp = req.body.no_hp;
    try {
      const user = await userModel.getUserByPhone(this.no_hp);
      if (!user) {
        throw new Error("Phone number is not yet registered.");
      }
      res.setHeader("Location", "/sign-in/verify-account");
      res.status(302).send();
    } catch (error) {
      req.flash("errors", [{ msg: error.message }]);
      res.setHeader("Location", "/sign-in");
      res.status(302).send();
    }
  }
  async verify(req, res) {
    try {
      this.no_hp = req.body.no_hp;
      const { acc_token, uuid } = await userModel.login(this.no_hp);
      const { full_name } = await userModel.getUserByPhone(this.no_hp);

      setCookie(res, "auth_token", acc_token, { maxAge: 15 * 60 });
      setCookie(res, "userId", uuid, { maxAge: 7 * 60 * 60 * 24 });

      const welcomeMessage = {
        title: `Welcome back, ${full_name}!`,
        body: "Check out our latest deals and enjoy shopping!",
        navigate: "/",
        category: "common",
        type: "home",
      };
      const joinMessage = {
        title: `Become a member!`,
        body: "Join our membership today  to get exclusive discount!",
        navigate: "/become-member",
        category: "payment",
        type: "becomemember",
      };
      await Promise.allSettled([
        notifModel.addNotif(req.cookies.userId, welcomeMessage),
        notifModel.addNotif(req.cookies.userId, joinMessage),
      ]);

      res.setHeader("Location", "/");
      res.status(302).send();
    } catch (error) {
      req.flash("errors", [{ msg: error.message }]);
      res.setHeader("Location", "/sign-in/verify-account");
      res.status(302).send();
    }
  }
  async logout(req, res) {
    const uuid = req.cookies.userId;
    await userModel.removeRefToken(uuid);
    removeCookie(res, "auth_token");
    removeCookie(res, "userId");
    return res.status(200).json({ message: "Successfully logged out", uuid });
  }
}

module.exports = LoginController;
