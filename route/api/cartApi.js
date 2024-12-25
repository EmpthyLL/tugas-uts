const CartController = require("../../app/controllers/CartController");
const guest = require("../../app/middlewares/guest");
const express = require("express");

const app = express.Router();

const cartController = new CartController();

app.post("/cart/add", async (req, res) => {
  try {
    await cartController.addToCart(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.post("/cart/increment", async (req, res) => {
  try {
    await cartController.incrementItem(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.post("/cart/decrement", async (req, res) => {
  try {
    await cartController.decrementItem(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.get("/cart/view", async (req, res) => {
  try {
    await cartController.getCartData(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
