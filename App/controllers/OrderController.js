const Controller = require("./Controller");

class OrderController extends Controller {
  constructor() {
    super();
    this.view = "order/order";
    this.layout = "layout";
    this.title = "Order";
    this.order = {};
  }

  async index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        order: this.order,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      if (error.message === "History entry not found.") {
        this.handleError(res, "Order is not found", 404);
      }
      this.handleError(res, "Failed to render map page", 500);
    }
  }
  complete(req, res) {
    this.user = getAuthUser(req, res, true);
    this.history.orderDone(req.userid, this.order.uuid);
    res.redirect(`/order/${this.order.uuid}/rate-driver`);
  }
  cancel(req, res) {
    this.user = getAuthUser(req, res, true);
    this.history.orderCancel(req.userid, this.order.uuid);
    res.redirect(`/`);
  }
  rateDriver(req, res) {
    const rating = req.body.rating;
    this.history.orderCancel(req.userid, this.order.uuid, rating);
    res.redirect(`/`);
  }
}

module.exports = OrderController;
