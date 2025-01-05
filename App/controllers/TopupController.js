const { topup } = require("../../database/model/userModel");
const Controller = require("./Controller");

class TopupController extends Controller {
  constructor() {
    super();
    this.view = "purchase/topup";
    this.layout = "layout";
    this.title = "Top Up";
  }

  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        balance: req.flash("balance") || [],
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.error("Error rendering top up page:", error);
      this.handleError(res, "Failed to render top up page", 500);
    }
  }
  async topup(req, res) {
    const amount = req.body.amount;
    await topup(req.cookies.userId, amount);
    res.redirect("/");
  }
}

module.exports = TopupController;
