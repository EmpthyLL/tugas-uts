const express = require("express");
const auth = require("../../App/Middlewares/auth");
const { notifController } = require("../controllers");

const app = express.Router();

app.get("/notification", auth, async (req, res) => {
  notifController.index(req, res);
});

module.exports = app;
