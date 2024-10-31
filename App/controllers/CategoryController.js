const fetch = require('node-fetch');
const Controller = require("./Controller");

class CategoryController extends Controller {
  constructor() {
    super();
    this.layout = 'layout';
    this.title = 'Products';
  }

  async index(req, res) {
    try {
      const categoryName = req.params.categoryName;

      const response = await fetch('https://dummyjson.com/products?limit=194');
      const data = await response.json();
      const products = data.products;

      // Filter produk berdasarkan kategori
      const filteredProducts = categoryName
        ? products.filter(product => product.category === categoryName)
        : products;

      const options = {
        layout: `components/${this.layout}`,
        title: `${categoryName ? categoryName + ' ' : ''}${this.title}`,
        req,
        menus: this.menus,
        categoryName,
        products: filteredProducts,
      };

      this.renderView(res, categoryName ? 'category' : 'index', options);
    } catch (error) {
      this.handleError(res, 'Failed to render category page', 500);
    }
  }
}

module.exports = CategoryController;