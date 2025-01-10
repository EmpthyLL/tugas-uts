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

app.post("/increment/:id", cektoken, async (req, res) => {
  try {
    await cartController.incrementItem(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.post("/decrement/:id", cektoken, async (req, res) => {
  try {
    await cartController.decrementItem(req, res);
  } catch (error) {
    console.log(error);
  }
});

app.get("/view", cektoken, async (req, res) => {
  try {
    await cartController.getCartData(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
