const express = require("express");
const auth = require("../../../app/middlewares/auth");
const { topupController } = require("../../controllers");

const app = express.Router();

app.get("/", auth, (req, res) => {
  topupController.index(req, res);
});
app.post("/", auth, (req, res) => {
  topupController.topup(req, res);
});

module.exports = app;
