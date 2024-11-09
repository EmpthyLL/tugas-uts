const UserModel = require("../../model/service/UserModel");
const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");

class TopupController extends Controller {
  constructor() {
    super();
    this.view = "topup";
    this.layout = "layout";
    this.title = "Top Up";
    this.user = {};
    this.model = new UserModel();
  }

  index(req, res) {
    try {
      this.user = getAuthUser(req, res, false);
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        balance: req.flash("balance") || [],
        keyword: "",
        user: this.user,
        cart: this.user.cart,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.error("Error rendering top up page:", error);
      this.handleError(res, "Failed to render top up page", 500);
    }
  }
  topup(req, res) {
    this.user = getAuthUser(req, res, false);
    const amount = req.body.amount;
    this.model.topUp(this.user.uuid, amount);
    res.redirect("/");
  }
}

module.exports = TopupController;
