const express = require("express");
const { orderController } = require("../controllers");

const app = express.Router();

app.get("/:id?", (req, res) => {
  orderController.index(req, res);
});

app.get("/:id/rateDriver", (req, res) => {
  orderController.index(req, res);
});

module.exports = app;
