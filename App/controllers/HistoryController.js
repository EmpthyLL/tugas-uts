const Controller = require("./Controller");
const historyModel = require("../../database/model/historyModel.js");

class HistoryController extends Controller {
  constructor() {
    super();
    this.view = ["history/history", "history/historyDetail"];
    this.layout = "layout";
    this.title = "Order History";
    this.page = 0;
  }
  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
      };

      this.renderView(res, this.view[this.page], options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render about page", 500);
    }
  }

  async detail(req, res) {
    try {
      const { id } = req.params;
      const history = await historyModel.getHistory(id, req.cookies.userId);
      if (!history) {
        return res.redirect("/history");
      }

      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        data: history,
        req,
      };
      this.renderView(res, this.view[this.page], options);
    } catch (error) {
      console.log(error);
    }
  }

  async getHistoryData(req, res) {
    try {
      const history = await historyModel.getHistory(req.cookies.userId);
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
