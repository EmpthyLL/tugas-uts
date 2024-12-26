const express = require("express");
const auth = require("../../App/Middlewares/auth");
const OrderController = require("../../app/controllers/OrderController");

const app = express.Router();
const orderController = new OrderController();

app.get("/:id", auth, (req, res) => {
  orderController.index(req, res);
});

app.get("/:id/rateDriver", auth, (req, res) => {
  orderController.index(req, res);
});

app.post("/complete", auth, (req, res) => {
  orderController.complete(req, res);
});

module.exports = app;
