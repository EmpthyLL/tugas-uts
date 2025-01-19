const cartModel = require("../../database/model/cartModel");
const historyModel = require("../../database/model/historyModel");
const userModel = require("../../database/model/userModel");
const Controller = require("./Controller");

class OrderController extends Controller {
  constructor() {
    super();
    this.view = "order/order";
    this.layout = "layout";
    this.title = "Order";
    this.delay = {
      3: { min: 10000, max: 15000 },
      4: { min: 8000, max: 12000 },
      5: { min: 5000, max: 8000 },
      6: { min: 10000, max: 15000 },
      7: { min: 3000, max: 5000 },
    };
  }

  async index(req, res) {
    try {
      const orderId = req.params.id;
      const cart = await cartModel.getUserCartList(req.cookies.userId);
      let inProcces = {};
      if (orderId) {
        this.order = await historyModel.getHistory(orderId, req.cookies.userId);
        if (!this.order || this.order.status === 1 || this.order.status === 2) {
          return res.redirect("/order");
        }
      } else {
        inProcces = await historyModel.cekOnProccess(req.cookies.userId);
        this.order = inProcces;
        if (inProcces) {
          return res.redirect(`/order/${inProcces.uuid}`);
        }
      }

      if (cart?.items === undefined && !this.order) {
        return res.redirect("/");
      }

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
  async getHistory(req, res) {
    try {
      const histories = await historyModel.getHistories(req.cookies.userId);
      return res.status(200).json({
        message: "Order canceled successfully",
        data: histories,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while retrieving the order",
        error: error.message,
      });
    }
  }
  async createOrder(req, res) {
    try {
      const { delivery, total } = req.body;
      if (!delivery) {
        return res
          .status(400)
          .json({ message: "Delivery details are required" });
      }
      const balance = await userModel.cekBalance(req.cookies.userId);
      if (total > parseFloat(balance)) {
        return res.status(400).json({
          message: "Oh no! Your balance is not enough. Please top up!",
        });
      }

      await historyModel.createOrder(req.cookies.userId, delivery, total);

      const message = {
        title: `Heading To Mart`,
        body: "Your driver is currently heading to mart.",
        navigate: `/order`,
        category: "order",
        type: "inprocess",
      };
      await notifModel.addNotif(req.cookies.userId, message);

      return res.status(201).json({
        message: "Order created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while creating the order",
        error: error.message,
      });
    }
  }
  async cancelOrder(req, res) {
    try {
      await historyModel.cancelOrder(req.cookies.userId, req.params.id);
      const message = {
        title: `Order Canceled`,
        body: "Your order has been canceled.",
        navigate: `/history/${req.params.id}`,
        category: "order",
        type: "cancel",
      };
      await notifModel.addNotif(req.cookies.userId, message);
      return res.status(200).json({
        message: "Order canceled successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while canceling the order",
        error: error.message,
      });
    }
  }

  async rateDriver(req, res) {
    try {
      const rating = req.body.rating;
      await historyModel.rateDriver(req.params.id, rating, req.cookies.userId);
      return res.status(200).json({
        message: "Order rated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while rating the order",
        error: error.message,
      });
    }
  }
  async updateStatus(req, res) {
    let inProcces;

    if (req.cookies.userId) {
      inProcces = await historyModel.cekOnProccess(req.cookies.userId);
      if (!inProcces) {
        return;
      }
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let currentStatus = inProcces.status;
    const processStartTime = inProcces.createdAt;

    const getElapsedTime = () => {
      const now = Date.now();
      return now - new Date(processStartTime).getTime();
    };

    const getRandomDelay = (status) => {
      const { min, max } = this.delay[status] || { min: 3000, max: 5000 };
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const sendStatusUpdate = async () => {
      const data = {
        status: currentStatus,
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);

      if (currentStatus < 7) {
        currentStatus++;

        const elapsedTime = getElapsedTime();
        const delay = getRandomDelay(currentStatus);

        await historyModel.updateStatus(
          req.cookies.userId,
          currentStatus,
          Date.now() + delay
        );

        let message;
        if (currentStatus === 4) {
          message = {
            title: `Arrived At Mart`,
            body: "Your driver has arrived at the mart.",
            navigate: `/order`,
            category: "order",
            type: "store",
          };
        } else if (currentStatus === 5) {
          message = {
            title: `Order Processed`,
            body: "Your order has been processed.",
            navigate: `/order`,
            category: "order",
            type: "confirm",
          };
        } else if (currentStatus === 6) {
          message = {
            title: `Heading To User`,
            body: "Your driver is currently heading to you.",
            navigate: `/order`,
            category: "order",
            type: "inprocess",
          };
        } else if (currentStatus === 7) {
          message = {
            title: `Order Arrived`,
            body: "Your order is here. Go out and pick it up",
            navigate: `/order`,
            category: "order",
            type: "arived",
          };
        }
        await notifModel.addNotif(req.cookies.userId, message);

        const nextUpdateTime = Math.max(delay - elapsedTime, 0);
        setTimeout(sendStatusUpdate, nextUpdateTime);
      } else {
        message = {
          title: `Order Completed`,
          body: "Your order is here. Go out and pick it up",
          navigate: `/history/${inProcces.uuid}`,
          category: "order",
          type: "complete",
        };
        await notifModel.addNotif(req.cookies.userId, message);
        res.write(
          `data: ${JSON.stringify({
            status: 1,
            label: "Order Completed",
            description: "The order has been successfully delivered.",
          })}\n\n`
        );
      }
    };

    await sendStatusUpdate();

    req.on("close", () => {
      console.log("SSE connection closed");
      res.end();
    });
  }
}

module.exports = OrderController;
