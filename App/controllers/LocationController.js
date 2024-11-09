const Controller = require("./Controller");

class LocationController extends Controller {
  constructor() {
    super();
    this.view = "location";
    this.layout = "layout";
    this.title = "Location";
  }

  async index(req, res) {
    try {
      this.user = getAuthUser(req, res, false); // Assuming this function gets the authenticated user
      const userLocation = {
        lat: 3.5952, // Example coordinates for the user's location
        lng: 98.678,
      };

      // List of store locations
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
        locations,
      };

      this.renderView(res, this.view, options); // This will render the `location.ejs` template with the above data
    } catch (error) {
      console.error("Error rendering map page:", error);
      this.handleError(res, "Failed to render map page", 500);
    }
  }
}

module.exports = LocationController;
