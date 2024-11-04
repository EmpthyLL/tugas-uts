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
    this.limit = 10; // Set the number of products per page
    this.sortBy = "price";
    this.order = "asc";
    this.totalPage = 0;
    this.totalItem = 0;
    this.brands = [];
    this.brand = "";
  }

  async index(req, res) {
    try {
      this.search = req.query.search || "";
      this.page = parseInt(req.query.page) || 1;
      this.sortBy = req.query.sortBy || "price";
      this.order = req.query.order || "asc";
      this.brand = req.query.brand || "";

      const categories = await this.fetchCategories();
      const products = await this.fetchData();

      if (this.search) {
        this.view = "search";
      } else {
        this.view = "index";
      }
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
        menus: this.menus,
        categories,
        products,
        keyword: this.search,
        selectedBrand: this.brand,
        sortBy: this.sortBy,
        order: this.order,
        brands: this.brands,
        selectedBrand: this.brand,
        totalPage: this.totalPage,
        totalItem: this.totalItem,
        page: this.page,
      };
      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render home page", 500);
    }
  }

  async fetchData() {
    if (this.search) {
      try {
        const res = await axios(
          `https://dummyjson.com/products/search?q=${this.search}`
        );

        let { total } = res.data;
        this.totalItem = total;

        const uniqueBrands = new Set();
        let allProducts = [];

        const fetchBrandPromises = [];
        this.totalPage = Math.ceil(total / 30);

        for (let i = 0; i < this.totalPage; i++) {
          fetchBrandPromises.push(
            axios(
              `https://dummyjson.com/products/search?q=${this.search}&skip=${
                i * 30
              }&limit=30`
            ).then((brandRes) => {
              brandRes.data.products.forEach((product) => {
                if (product.brand) {
                  uniqueBrands.add(product.brand);
                }
                allProducts.push(product);
              });
            })
          );
        }

        await Promise.all(fetchBrandPromises);

        allProducts.sort((a, b) => {
          if (this.sortBy === "price") {
            // use the local sortBy variable
            const priceA = a.price;
            const priceB = b.price;
            return this.order === "asc" ? priceA - priceB : priceB - priceA; // use the local order variable
          } else {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            return this.order === "asc"
              ? titleA.localeCompare(titleB) // Corrected: Title should compare correctly
              : titleB.localeCompare(titleA);
          }
        });

        this.brands = Array.from(uniqueBrands);

        // Filter by brand if selected
        if (this.brand) {
          allProducts = allProducts.filter(
            (product) => product.brand === this.brand
          );
          this.totalPage = Math.ceil(allProducts.length / 30);
        }
        const itemsPerPage = 30;
        const startIndex = (this.page - 1) * itemsPerPage;
        const endIndex = this.page * itemsPerPage;
        const paginatedProducts = allProducts.slice(startIndex, endIndex);

        return paginatedProducts;
      } catch (error) {
        console.error("Error fetching products:", error);
        this.handleError(res, "Failed to fetch product data", 500);
      }
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
      return categoryData;
    }
  }

  async fetchCategories() {
    const res = await axios.get("https://dummyjson.com/products/categories");
    return res.data;
  }
}

module.exports = HomeController;
