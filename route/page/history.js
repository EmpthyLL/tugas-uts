const express = require("express");
const { historyController } = require("../controllers");

const app = express.Router();

app.get("/", async (req, res) => {
  historyController.index(req, res);
});
app.get("/:uuid?", async (req, res) => {
  historyController.detail(req, res);
});

module.exports = app;
