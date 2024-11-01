const { default: axios } = require("axios");
const Controller = require("./Controller");

class CategoryController extends Controller {
  constructor() {
    super();
    this.layout = "layout";
  }

  async index(req, res) {
    try {
      const categoryName = req.params.categoryName;

      const response = await axios(
        `https://dummyjson.com/products/category/${categoryName}`
      );
      const title = response.data.products[0].category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const options = {
        layout: `components/${this.layout}`,
        title: `${title} Products`,
        req,
        menus: this.menus,
        products: response.data.products,
      };

      this.renderView(res, categoryName ? "category" : "index", options);
    } catch (error) {
      this.handleError(res, "Failed to render category page", 500);
    }
  }
}

module.exports = CategoryController;
