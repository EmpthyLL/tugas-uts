const { default: axios } = require("axios");
const Controller = require("./Controller");
const historyModel = require("../../database/model/historyModel");

class CategoryController extends Controller {
  constructor() {
    super();
    this.layout = "layout";
  }

  async index(req, res) {
    try {
      const categoryName = req.params.categoryName;

      if (!categoryName) {
        return res.redirect("/");
      }

      const sortBy = req.query.sortBy || "price";
      const order = req.query.order || "asc";
      const selectedBrand = req.query.brand || "";

      // Fetch the products
      const response = await axios(
        `https://dummyjson.com/products/category/${categoryName}`
      );

      // Get products and apply filters/sorting
      let products = response.data.products;

      if (products.length === 0) {
        return res.redirect("/");
      }

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

      const inProcces = await historyModel.cekOnProccess(req.cookies.userId);
      let process = false;
      if (inProcces) {
        process = true;
      }
      const options = {
        layout: `components/${this.layout}`,
        title: `${title} Products`,
        req,
        products,
        sortBy,
        order,
        process,
        selectedBrand,
        brands: [
          ...new Set(
            response.data.products.map((p) => p.brand).filter((brand) => brand)
          ),
        ],
      };

      this.renderView(
        res,
        categoryName ? "index/category" : "index/index",
        options
      );
    } catch (error) {
      console.log(error);
      if (error.message === "No results found.") {
        this.handleError(res, "Category is not available", 404);
      } else {
        console.log(error.message);
        this.handleError(res, "Failed to render category page", 500);
      }
    }
  }
}

module.exports = CategoryController;
