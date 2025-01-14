const express = require("express");
const { orderController } = require("../controllers");

const app = express.Router();

app.post("/", (req, res) => {
  orderController.createOrder(req, res);
});

module.exports = app;
