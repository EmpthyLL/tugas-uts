const { default: axios } = require("axios");
const Controller = require("./Controller");

class HomeController extends Controller {
  constructor() {
    super();
    this.view = "index";
    this.layout = "layout";
    this.title = "Home Page";
    this.search = "";
    this.page = 1;
    this.limit = 30; // Set the number of products per page
    this.sortBy = "price";
    this.order = "desc";
    this.brand = "";
  }

  async index(req, res) {
    this.search = req.query.search || "";
    this.page = parseInt(req.query.page) || 1; // Convert to integer
    this.sortBy = req.query.sortBy || "price";
    this.order = req.query.order || "asc";
    this.brand = req.query.brand || "";

    if (this.search) {
      this.view = "search";
    } else {
      this.view = "index";
    }

    const categories = await this.fetchCategories();
    const { products, brands, totalProducts } = await this.fetchData();
    const totalPages = Math.ceil(totalProducts / this.limit); // Calculate total pages

    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        categories,
        products,
        brands,
        keyword: this.search,
        selectedBrand: this.brand,
        sortBy: this.sortBy,
        order: this.order,
        totalPages, // Pass total pages to the view
        page: this.page, // Pass current page to the view
      };
      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }

  async fetchData() {
    const offset = (this.page - 1) * this.limit; // Calculate offset for pagination
    let totalProducts = 0;
    let products = [];
    let brands = [];

    if (this.search) {
      const searchResponse = await axios.get(
        `https://dummyjson.com/products/search?q=${this.search}&sortBy=${this.sortBy}&order=${this.order}&limit=${this.limit}&skip=${offset}`
      );
      products = searchResponse.data.products;
      totalProducts = searchResponse.data.total; // Get total products from the response
      products = products.filter(
        (product) => !this.brand || product.brand === this.brand
      );
      brands = [...new Set(products.map((product) => product.brand))];
    } else {
      const categories = await this.fetchCategories();
      const categoryData = await Promise.all(
        categories.map(async (category) => {
          const productRes = await axios.get(
            `https://dummyjson.com/products/category/${category.slug}`
          );
          let products = productRes.data.products;

          return { name: category.name, products };
        })
      );
      products = categoryData.flatMap((item) => item.products); // Flatten the array
      totalProducts = products.length; // Count total products for pagination
    }

    return { products, brands, totalProducts }; // Return totalProducts as well
  }

  async fetchCategories() {
    const res = await axios.get("https://dummyjson.com/products/categories");
    return res.data;
  }
}

module.exports = HomeController;
