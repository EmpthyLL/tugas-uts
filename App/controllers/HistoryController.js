const Controller = require("./Controller");

class HistoryController extends Controller {
  constructor() {
    super();
    this.view = "history/history";
    this.layout = "layout";
    this.title = "Order History";
    const status = {
      1: "Completed",
      2: "Canceled",
      3: "Heading to Mart",
      4: "Arrived at Mart",
      5: "Heading to User",
      6: "Arrived at User",
    };
  }
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,

        cart: this.user.cart,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render about page", 500);
    }
  }
}

module.exports = HistoryController;
