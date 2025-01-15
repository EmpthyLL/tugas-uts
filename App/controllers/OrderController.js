const cartModel = require("../../database/model/cartModel");
const historyModel = require("../../database/model/historyModel");
const Controller = require("./Controller");

class OrderController extends Controller {
  constructor() {
    super();
    this.view = "order/order";
    this.layout = "layout";
    this.title = "Order";
    this.status = {
      1: {
        label: "Completed",
        description: "The order has been successfully delivered.",
      },
      2: {
        label: "Canceled",
        description: "The order was canceled by the user or driver.",
      },
      3: {
        label: "To Mart",
        description: "The driver is heading to the mart.",
      },
      4: {
        label: "At Mart",
        description: "The driver has arrived at the mart.",
      },
      5: {
        label: "Processed",
        description: "The order has been picked and paid for.",
      },
      6: {
        label: "To User",
        description: "The driver is heading to the user.",
      },
      7: {
        label: "Arrived",
        description: "The driver has arrived at the user's location.",
      },
    };
  }

  async index(req, res) {
    try {
      const orderId = req.params.id;
      const cart = await cartModel.getUserCartList(req.cookies.userId);
      if (cart?.items === undefined) {
        return res.redirect("/");
      }
      let inProcces = {};
      if (orderId) {
        this.order = await historyModel.getHistory(orderId);
        if (!this.order) {
          return res.redirect("/order");
        }
      } else {
        inProcces = await historyModel.cekOnProccess(req.cookies.userId);
        this.order = inProcces;
        if (inProcces) {
          return res.redirect(`/order/${inProcces.uuid}`);
        }
      }

      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        order: this.order,
        inProcces,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      if (error.message === "History entry not found.") {
        this.handleError(res, "Order is not found", 404);
      }
      this.handleError(res, "Failed to render map page", 500);
    }
  }
  async createOrder(req, res) {
    try {
      const { delivery } = req.body;

      if (!delivery) {
        return res
          .status(400)
          .json({ message: "Delivery details are required" });
      }

      const order = await historyModel.createOrder(
        req.cookies.userId,
        delivery
      );

      return res.status(201).json({
        message: "Order created successfully",
        order,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({
        message: "An error occurred while creating the order",
        error: error.message,
      });
    }
  }

  complete(req, res) {
    this.history.orderDone(req.userid, this.order.uuid);
    res.redirect(`/order/${this.order.uuid}/rate-driver`);
  }
  cancel(req, res) {
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
