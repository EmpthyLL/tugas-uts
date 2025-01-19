const express = require("express");
const { orderController } = require("../controllers");
const cektoken = require("../../app/middlewares/cektoken");

const app = express.Router();

app.post("/", cektoken, async (req, res) => {
  await orderController.createOrder(req, res);
});
app.delete("/:id", cektoken, async (req, res) => {
  await orderController.cancelOrder(req, res);
});

module.exports = app;
