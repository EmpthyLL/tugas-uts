const express = require("express");
const auth = require("../../App/Middlewares/auth");
const { orderController } = require("../controllers");

const app = express.Router();

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
