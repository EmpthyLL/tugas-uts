const express = require("express");
const auth = require("../../app/middlewares/auth");
const { cartController } = require("../controllers");

const app = express.Router();

app.get("/", auth, async (req, res) => {
  cartController.index(req, res);
});

app.post("/payment", auth, async (req, res) => {
  cartController.payment(req, res);
});

module.exports = app;
