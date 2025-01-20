const express = require("express");
const { orderController } = require("../controllers");
const cektoken = require("../../app/middlewares/cektoken");

const app = express.Router();

app.get("/", cektoken, (req, res) => {
  orderController.getHistory(req, res);
});
app.post("/", cektoken, async (req, res) => {
  await orderController.createOrder(req, res);
});
app.delete("/:id", cektoken, async (req, res) => {
  await orderController.cancelOrder(req, res);
});
app.post("/rate/:id", cektoken, async (req, res) => {
  await orderController.rateDriver(req, res);
});
app.get("/status", cektoken, async (req, res) => {
  await orderController.updateStatus(req, res);
});
module.exports = app;
