const express = require("express");
const { notifController } = require("../controllers");

const app = express.Router();

app.get("/", async (req, res) => {
  notifController.index(req, res);
});

module.exports = app;
