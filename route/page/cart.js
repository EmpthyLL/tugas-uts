const express = require("express");
const { cartController } = require("../controllers");

const app = express.Router();

app.get("/", async (req, res) => {
  cartController.index(req, res);
});

app.post("/payment", async (req, res) => {
  cartController.payment(req, res);
});

module.exports = app;
