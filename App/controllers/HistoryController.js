const Controller = require("./Controller");
const historyModel = require("../../database/model/historyModel.js");

class HistoryController extends Controller {
  constructor() {
    super();
    this.view = "history/history";
    this.layout = "layout";
    this.title = "Order History";
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
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render about page", 500);
    }
  }

  async getHistoryData(req, res) {
    try {
      const history = await historyModel.getHistories(req.cookies.userId);
      if (!history) {
        return res.status(404).json({ message: "History not found" });
      }
      res
        .status(200)
        .json({ message: "History retrieved successfully", history });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Failed to retrieve history data" });
    }
  }
}

module.exports = HistoryController;