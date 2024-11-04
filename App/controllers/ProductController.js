const { default: axios } = require("axios");
const Controller = require("./Controller");

class ProductController extends Controller {
    constructor() {
        super();
        this.layout = "layout";
        this.title = "Product List";
        this.view = "index";
    }

    async index(req, res) {
        try {
            const id = req.params.id;

            const response = await axios(`https://dummyjson.com/products/${id}`);
            const products = response.data;
            
            const product = products.find(p => p.title.toLowerCase() === productName.toLowerCase());

            if (!product || !product.title) {
                console.log("Product not found:", id);
                return res.status(404).send("Product not found");
            }

            const options = {
                layout: `components/${this.layout}`,
                title: `${product.title} - Product Detail`,
                req,
                menus: this.menus || [],
                product,
            };

            this.renderView(res, "productDetail", options);
        } catch (error) {
            console.error("Error fetching product data:", error);
            this.handleError(res, "Failed to render product page", 500);
        }
    }
}

module.exports = ProductController;