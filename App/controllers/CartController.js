const { default: axios } = require("axios");
const Controller = require("./Controller");

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

  // Add item to cart
  async addToCart(req, res) {
    try {
      const { productId } = req.body;
      const { data } = await axios.get(
        `https://dummyjson.com/products/${productId}`
      );

      const newItem = {
        id: data.id,
        title: data.title,
        price: data.price,
        brand: data.brand || null,
        category: data.category,
        thumbnail: data.thumbnail,
        quantity: 1,
      };

      await this.cart.addItem(req.userid, newItem);
      res.status(200).json({ message: "Item added to cart", item: newItem });
    } catch (error) {
      this.handleError(res, "Failed to add item to cart", 500);
    }
  }

  // Increment item quantity in cart
  async incrementItem(req, res) {
    try {
      const { productId } = req.body;
      if (user) {
        const newQuantity = await this.cart.incrementItem(
          req.userid,
          Number(productId)
        );
        res
          .status(200)
          .json({ message: "Item incremented", quantity: newQuantity });
      } else {
        return res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to increment item", 500);
    }
  }

  // Decrement item quantity in cart
  async decrementItem(req, res) {
    try {
      const { productId } = req.body;

      if (user) {
        const newQuantity = await this.cart.decrementItem(
          req.userid,
          Number(productId)
        );
        res
          .status(200)
          .json({ message: "Item decremented", quantity: newQuantity });
      } else {
        res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to decrement item", 500);
    }
  }

  async getCartData(req, res) {
    try {
      const user = getAuthUser(req, res, true);
      if (user) {
        res
          .status(200)
          .json({ message: "Data has been retrive", data: user.cart });
      } else {
        res.status(400).json({ message: "User not authenticated" });
      }
    } catch (error) {
      this.handleError(res, "Failed to retrive items", 500);
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

    const newId = this.history.addEntry(req.userid, this.user.cart);

    res.redirect(`/order/${newId}`);
  }
}

module.exports = CartController;
