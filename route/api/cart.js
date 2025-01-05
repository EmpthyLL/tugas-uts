const auth = require("../../app/middlewares/auth");
const cektoken = require("../../app/middlewares/cektoken");
const express = require("express");
const { cartController } = require("../controllers");

const app = express.Router();

app.post("/add/:id", async (req, res) => {
  try {
    await cartController.addToCart(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.post("/increment/:cartid/:id", async (req, res) => {
  try {
    await cartController.incrementItem(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.post("/decrement/:cartid/:id", async (req, res) => {
  try {
    await cartController.decrementItem(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.get("/view", async (req, res) => {
  try {
    await cartController.getCartData(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
