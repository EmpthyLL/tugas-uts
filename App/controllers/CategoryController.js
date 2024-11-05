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
      const sortBy = req.query.sortBy || "price"; // Default sort by price
      const order = req.query.order || "asc"; // Default order is ascending
      const selectedBrand = req.query.brand || ""; // Selected brand filter

      // Fetch the products
      const response = await axios(
        `https://dummyjson.com/products/category/${categoryName}`
      );

      // Get products and apply filters/sorting
      let products = response.data.products;

      // Filter by brand if selected
      if (selectedBrand) {
        products = products.filter(
          (product) => product.brand === selectedBrand
        );
      }

      // Sort products
      products.sort((a, b) => {
        if (sortBy === "price") {
          // use the local sortBy variable
          const priceA = a.price;
          const priceB = b.price;
          return order === "asc" ? priceA - priceB : priceB - priceA; // use the local order variable
        } else {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          return order === "asc"
            ? titleA.localeCompare(titleB) // Corrected: Title should compare correctly
            : titleB.localeCompare(titleA);
        }
      });

      const title = response.data.products[0].category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      const options = {
        layout: `components/${this.layout}`,
        title: `${title} Products`,
        req,
        menus: this.menus,
        products,
        keyword: "",
        sortBy,
        order,
        selectedBrand,
        brands: [
          ...new Set(
            response.data.products.map((p) => p.brand).filter((brand) => brand)
          ),
        ],
      };

      this.renderView(res, categoryName ? "category" : "index", options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render category page", 500);
    }
  }
}

module.exports = CategoryController;