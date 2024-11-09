const HistoryModel = require("../../model/service/HistoryModel");
const formatDate = require("../../utils/formateDate");
const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");

class LocationController extends Controller {
  constructor() {
    super();
    this.view = ["location", "detail"];
    this.layout = "layout";
    this.title = "Order";
    this.history = new HistoryModel();
    this.order = {};
  }

  async index(req, res) {
    try {
      this.user = getAuthUser(req, res, false);
      const id = req.params.id;
      if (this.user.history.length === 0) {
        res.redirect("/");
      }
      this.order = this.history.getHistoryByUuid(id);
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
}

module.exports = LocationController;
