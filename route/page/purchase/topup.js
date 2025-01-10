const express = require("express");
const { topupController } = require("../../controllers");

const app = express.Router();

app.get("/", (req, res) => {
  topupController.index(req, res);
});
app.post("/", (req, res) => {
  topupController.topup(req, res);
});

module.exports = app;
