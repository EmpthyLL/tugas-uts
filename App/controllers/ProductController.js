const { default: axios } = require("axios");
const Controller = require("./Controller");
const getAuthUser = require("../../utils/user");

class ProductController extends Controller {
  constructor() {
    super();
    this.layout = "layout";
    this.user = {};
  }

  // Render standalone product page (productDetail.ejs)
  async index(req, res) {
    try {
      this.user = getAuthUser(req);
      const id = req.params.id;

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
        user: this.user,
        categoryName: product.category.toLowerCase().replace(/\s+/g, "-"),
      };

      this.renderView(res, "productDetail", options);
    } catch (error) {
      console.error("Error fetching product data:", error);
      this.handleError(res, "Failed to render product page", 500);
    }
  }

  // Render product page within a category context (detailCategory.ejs)
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
      this.handleError(res, "Failed to render product page", 500);
    }
  }
}

module.exports = ProductController;
