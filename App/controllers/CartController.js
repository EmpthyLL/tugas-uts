const { default: axios } = require("axios");
const Controller = require("./Controller");
const getAuthUser = require("../../utils/user");
const formatDate = require("../../utils/formateDate");
const CartModel = require("../../model/service/CartModel");

class CartController extends Controller {
  constructor() {
    super();
    this.view = "cart";
    this.layout = "layout";
    this.title = "Your Cart";
    this.user = {};
    this.cart = new CartModel();
  }

  async index(req, res) {
    try {
      this.user = getAuthUser(req);

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
        keyword: "",
        user: this.user,
        formatDate,
      };
      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render cart page", 500);
    }
  }

  // Add item to cart
  async addToCart(req, res) {
    try {
      const { itemId } = req.body;
      const { data } = await axios.get(
        `https://dummyjson.com/products/${itemId}`
      );

      const newItem = {
        id: data.id,
        title: data.title,
        price: data.price,
        thumbnail: data.thumbnail,
        quantity: 1,
      };

      const user = getAuthUser(req);
      if (user) {
        await this.cart.addItem(user.uuid, newItem);
        res.status(200).json({ message: "Item added to cart", item: newItem });
      } else {
        res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to add item to cart", 500);
    }
  }

  // Increment item quantity in cart
  async incrementItem(req, res) {
    try {
      const { itemId } = req.body;
      const user = getAuthUser(req);

      if (user) {
        await this.cart.incrementItem(user.uuid, itemId);
        res.status(200).json({ message: "Item incremented" });
      } else {
        res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to increment item", 500);
    }
  }

  // Decrement item quantity in cart
  async decrementItem(req, res) {
    try {
      const { itemId } = req.body;
      const user = getAuthUser(req);

      if (user) {
        await this.cart.decrementItem(user.uuid, itemId);
        res.status(200).json({ message: "Item decremented" });
      } else {
        res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to decrement item", 500);
    }
  }

  // Utility method to handle errors
  handleError(res, message, statusCode) {
    res.status(statusCode).json({ message });
  }
}

module.exports = CartController;
