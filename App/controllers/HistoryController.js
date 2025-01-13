const Controller = require("./Controller");
const historyModel = require("../../database/model/historyModel.js")

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
        res.status(200).json({ message: "History retrieved successfully", history });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ message: error.message || "Failed to retrieve history data" });
      }
    }
}



module.exports = HistoryController;
