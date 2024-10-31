const { default: axios } = require("axios");
const Controller = require("./Controller");

class HomeController extends Controller {
  constructor() {
    super();
    this.view = "index";
    this.layout = "layout";
    this.title = "Home Page";
  }
  async index(req, res) {
    const categories = await axios("https://dummyjson.com/products/categories");
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        categories,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }
  fetchData() {}
}

module.exports = HomeController;
