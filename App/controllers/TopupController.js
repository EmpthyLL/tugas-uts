const userModel = require("../../database/model/userModel");
const Controller = require("./Controller");

class TopupController extends Controller {
  constructor() {
    super();
    this.view = "purchase/topup";
    this.layout = "layout";
    this.title = "Top Up";
    this.methods = {
      minimart: ["Indomaret", "Alfamart", "Alfamidi"],
      digwall: ["Dana", "Gopay", "OVO"],
      bank: ["BCA", "BRI", "BNI", "BI", "Mandiri"],
    };
  }

  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        balance: req.flash("balance") || [],
        methods: this.methods,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.error("Error rendering top up page:", error);
      this.handleError(res, "Failed to render top up page", 500);
    }
  }
  async topup(req, res) {
    const { amount, method } = req.body;

    if (!amount || !method) {
      return res
        .status(400)
        .json({ success: false, message: "Amount and method are required." });
    }

    await userModel.topup(req.cookies.userId, amount);

    return res.status(200).json({
      success: true,
      message: "Top-up successful.",
      data: { amount, method },
    });
  }
}

module.exports = TopupController;
