const express = require("express");
const { notifController } = require("../controllers");

const app = express.Router();

app.get("/notification", async (req, res) => {
  notifController.index(req, res);
});

module.exports = app;
