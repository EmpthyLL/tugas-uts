const formatDate = require("../../utils/formateDate");
const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");
const CartModel = require("../../model/service/CartModel");

class LocationController extends Controller {
  constructor() {
    super();
    this.view = "location";
    this.layout = "layout";
    this.title = "Location";
    this.cart = new CartModel();
  }

  async index(req, res) {
    try {
      this.user = getAuthUser(req, res, false);

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
        user: this.user,
        cart: this.user ? this.user.cart : null,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      console.error("Error rendering map page:", error);
      this.handleError(res, "Failed to render map page", 500);
    }
  }

  async getCartData(req, res) {
    try {
      const user = getAuthUser(req, res, true); 
      if (user) {
        res.status(200).json({ message: "Data has been retrieved", data: user.cart });
      } else {
        res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      console.error("Error retrieving cart data:", error);
      this.handleError(res, "Failed to retrieve items", 500);
    }
  }
}

module.exports = LocationController;