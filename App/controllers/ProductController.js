const { default: axios } = require("axios");
const Controller = require("./Controller");

class ProductController extends Controller {
  constructor() {
    super();
    this.layout = "layout";
    this.view = "index/productDetail";
  }

  async index(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.redirect("/");
      }

      const response = await axios(`https://dummyjson.com/products/${id}`);
      const product = response.data;

      const relatedResponse = await axios(
        `https://dummyjson.com/products/category/${product.category}`
      );
      const relatedProducts = relatedResponse.data.products.filter(
        (p) => p.id !== product.id
      );

      const MAX_RECOMMENDED = 6;
      const limitedRelatedProducts = relatedProducts.slice(0, MAX_RECOMMENDED);

      const options = {
        layout: `components/${this.layout}`,
        title: `${product.title} - Product Detail`,
        req,
        product,
        relatedProducts: limitedRelatedProducts,
        categoryName: product.category.toLowerCase().replace(/\s+/g, "-"),
      };

      this.renderView(res, this.view, options);
    } catch (error) {
      if (error.message === "Request failed with status code 404") {
        res.redirect("/");
      } else {
        console.log(error.message);
        this.handleError(res, "Failed to render product page", 500);
      }
    }
  }

  async productInCategory(req, res) {
    try {
      const { categoryName, id } = req.params;

      const response = await axios(`https://dummyjson.com/products/${id}`);
      const product = response.data;

      const relatedResponse = await axios(
        `https://dummyjson.com/products/category/${product.category}`
      );
      const relatedProducts = relatedResponse.data.products.filter(
        (p) => p.id !== product.id
      );

      const MAX_RECOMMENDED = 6;
      const limitedRelatedProducts = relatedProducts.slice(0, MAX_RECOMMENDED);

      const options = {
        layout: `components/${this.layout}`,
        title: `${product.title} - Product Detail`,
        req,
        menus: this.menus || [],
        product,
        relatedProducts: limitedRelatedProducts,
        keyword: "",
        categoryName: categoryName.toLowerCase().replace(/\s+/g, "-"),
      };

      this.renderView(res, "productDetail", options);
    } catch (error) {
      console.error("Error fetching product data:", error);
      this.handleError(res, error.message, 500);
    }
  }
}

module.exports = ProductController;
