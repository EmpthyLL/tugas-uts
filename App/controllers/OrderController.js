const HistoryModel = require("../../model/service/HistoryModel");
const formatDate = require("../../utils/formateDate");
const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");
const CartModel = require("../../model/service/CartModel");

class OrderController extends Controller {
  constructor() {
    super();
    this.view = "order/order";
    this.layout = "layout";
    this.title = "Order";
    this.history = new HistoryModel();
    this.cart = new CartModel();
    this.order = {};
    this.user = {};
  }

  async index(req, res) {
    try {
      this.user = getAuthUser(req, res, true);

      const orderId = req.params.id;
      this.order = this.history.getHistoryByUuid(this.user.uuid, orderId);

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
        menus: this.menus,
        keyword: "",
        userLocation,
        formatDate,
        locations,
        cart: this.order.cart,
        user: this.user,
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
    this.history.orderDone(this.user.uuid, this.order.uuid);
    res.redirect(`/order/${this.order.uuid}/rate-driver`);
  }
  cancel(req, res) {
    this.user = getAuthUser(req, res, true);
    this.history.orderCancel(this.user.uuid, this.order.uuid);
    res.redirect(`/`);
  }
  rateDriver(req, res) {
    const rating = req.body.rating;
    this.history.orderCancel(this.user.uuid, this.order.uuid, rating);
    res.redirect(`/`);
  }
}

module.exports = OrderController;
