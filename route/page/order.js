const express = require("express");
const { orderController } = require("../controllers");

const app = express.Router();

app.get("/", (req, res) => {
  orderController.index(req, res);
});
app.get("/:id", (req, res) => {
  orderController.index(req, res);
});

app.get("/:id/rateDriver", (req, res) => {
  orderController.index(req, res);
});

app.post("/complete", (req, res) => {
  orderController.complete(req, res);
});

module.exports = app;
