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
    const categories = await this.fetcCategories();
    const products = await this.fetchData();

    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        categories,
        products,
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }
  async fetchData() {
    const categories = await this.fetcCategories();
    const res = await Promise.all(
      categories.map(async (category) => {
        const productRes = await axios(
          `https://dummyjson.com/products/category/${category.slug}`
        );
        const products = productRes.data.products;

        return [category.name, products];
      })
    );
    return res;
  }
  async fetcCategories() {
    const res = await axios("https://dummyjson.com/products/categories");
    return res.data;
  }
}

module.exports = HomeController;
