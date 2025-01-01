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
      const orderId = req.params.id;
      this.order = this.history.getHistoryByUuid(req.userid, orderId);

      const userLocation = {
        lat: 3.5952,
        lng: 98.678,
      };

      const locations = [
        { name: "Alfamart", lat: 3.5784, lng: 98.6789 },
        { name: "Indomaret", lat: 3.5953, lng: 98.6743 },
        { name: "Alfamidi", lat: 3.5952, lng: 98.678 },
      ];

      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        userLocation,

        locations,
        cart: this.order.cart,
        order: this.order,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.error("Error rendering map page:", error);
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
