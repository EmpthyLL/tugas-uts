const express = require("express");
const auth = require("../../../App/Middlewares/auth");
const TopupController = require("../../../app/controllers/TopupController");

const app = express.Router();

const topupController = new TopupController();

app.get("/", auth, (req, res) => {
  topupController.index(req, res);
});
app.post("/", auth, (req, res) => {
  topupController.topup(req, res);
});

module.exports = app;
