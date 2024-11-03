const { default: axios } = require("axios");
const Controller = require("./Controller");

class HomeController extends Controller {
  constructor() {
    super();
    this.view = "index";
    this.layout = "layout";
    this.title = "Home Page";
    this.keyword = "";
    this.search = "";
    this.page = 1;
    this.sortBy = "price";
    this.order = "desc";
    this.brand = "";
  }

  async index(req, res) {
    this.search = req.query.search || "";
    this.page = req.query.page || 1;
    this.sortBy = req.query.sortBy || "price";
    this.order = req.query.order || "asc";
    this.brand = req.query.brand || "";

    this.keyword = this.search;
    if (this.keyword) {
      this.view = "search";
    }

    const categories = await this.fetchCategories();
    const { products, brands } = await this.fetchData();

    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        categories,
        products,
        brands,
        keyword: this.keyword,
        selectedBrand: this.brand,
        sortBy: this.sortBy,
        order: this.order,
      };
      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }

  async fetchData() {
    if (this.keyword) {
      const searchResponse = await axios.get(
        `https://dummyjson.com/products/search?q=${this.keyword}&sortBy=${this.sortBy}&order=${this.order}`
      );
      const products = searchResponse.data.products.filter(
        (product) => !this.brand || product.brand === this.brand
      );
      const brands = [...new Set(products.map((product) => product.brand))];

      return { products, brands };
    } else {
      const categories = await this.fetchCategories();
      const categoryData = await Promise.all(
        categories.map(async (category) => {
          const productRes = await axios.get(
            `https://dummyjson.com/products/category/${category.slug}?sortBy=${this.sortBy}&order=${this.order}`
          );
          let products = productRes.data.products;

          if (this.brand) {
            products = products.filter(
              (product) => product.brand === this.brand
            );
          }

          return { name: category.name, products };
        })
      );

      const products = categoryData.flatMap((category) => category.products);
      const brands = [...new Set(products.map((product) => product.brand))];

      return { products: categoryData, brands };
    }
  }

  async fetchCategories() {
    const res = await axios.get("https://dummyjson.com/products/categories");
    return res.data;
  }
}

module.exports = HomeController;
