const express = require("express");
const { orderController } = require("../controllers");
const cektoken = require("../../app/middlewares/cektoken");

const app = express.Router();

app.post("/", cektoken, (req, res) => {
  orderController.createOrder(req, res);
});
app.delete("/:id", cektoken, (req, res) => {
  orderController.cancelOrder(req, res);
});

module.exports = app;
