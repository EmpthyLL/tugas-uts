const { default: axios } = require("axios");
const Controller = require("./Controller");
const cartModel = require("../../database/model/cartModel");

class CartController extends Controller {
  constructor() {
    super();
    this.view = "cart/cart";
    this.layout = "layout";
    this.title = "Your Cart";
  }

  async index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title,
        req,
      };
      this.renderView(res, this.view, options);
    } catch (error) {
      this.handleError(res, "Failed to render cart page", 500);
    }
  }

  async addToCart(req, res) {
    try {
      const { id: item_id } = req.params;
      const { data } = await axios.get(
        `https://dummyjson.com/products/${item_id}`
      );

      const newItem = {
        item_id: data.id,
        title: data.title,
        price: data.price,
        brand: data.brand || null,
        category: data.category,
        thumbnail: data.thumbnail,
        quantity: 1,
      };

      await cartModel.addItem(req.cookies.userId, newItem);
      res.status(200).json({ message: "Item added to cart", item: newItem });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Failed to add item to cart" });
    }
  }

  // Increment item quantity
  async incrementItem(req, res) {
    try {
      const { id: item_id } = req.params;
      const exist = await cartModel.getCartItem(item_id, req.cookies.userId);
      let newQuantity;
      if (exist) {
        newQuantity = await cartModel.AddQuantity(item_id, req.cookies.userId);
      } else {
        newQuantity = 1;
        const { data } = await axios.get(
          `https://dummyjson.com/products/${item_id}`
        );
        const newItem = {
          item_id: data.id,
          title: data.title,
          price: data.price,
          brand: data.brand || null,
          category: data.category,
          thumbnail: data.thumbnail,
          quantity: newQuantity,
        };

        await cartModel.addItem(req.cookies.userId, newItem);
      }
      res
        .status(200)
        .json({ message: "Item quantity incremented", quantity: newQuantity });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error.message || "Failed to increment item quantity",
      });
    }
  }

  // Decrement item quantity
  async decrementItem(req, res) {
    try {
      const { id: item_id } = req.params;
      const exist = await cartModel.getCartItem(item_id, req.cookies.userId);
      let newQuantity;
      if (exist) {
        newQuantity = await cartModel.ReduceQuantity(
          item_id,
          req.cookies.userId
        );
      } else {
        newQuantity = 0;
      }
      res
        .status(200)
        .json({ message: "Item quantity decremented", quantity: newQuantity });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: error.message || "Failed to decrement item quantity",
      });
    }
  }

  // Get cart data
  async getCartData(req, res) {
    try {
      const cart = await cartModel.getUserCartList(req.cookies.userId);
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.status(200).json({ message: "Cart retrieved successfully", cart });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Failed to retrieve cart data" });
    }
  }

  payment(req, res) {
    this.user = getAuthUser(req, res, false);

    if (this.user.history.length > 0) {
      if (this.user.history[0].status === "Ongoing") {
        res.redirect(`/order/${this.user.history[0].uuid}`);
      }
    }

    const price = this.user.cart.total;

    if (!cekBalance(this.user, price, req, res)) return;

    const newId = this.history.addEntry(cart_id, this.user.cart);

    res.redirect(`/order/${newId}`);
  }
}

module.exports = CartController;
