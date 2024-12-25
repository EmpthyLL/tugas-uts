const CartController = require("../../app/controllers/CartController");
const express = require("express");
const auth = require("../../App/Middlewares/auth");

const app = express.Router();

const cartController = new CartController();

app.get("/", auth, async (req, res) => {
  cartController.index(req, res);
});

app.post("/payment", auth, async (req, res) => {
  cartController.payment(req, res);
});

module.exports = app;
