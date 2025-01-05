const express = require("express");
const { historyController } = require("../controllers");

const app = express.Router();

app.get("/", async (req, res) => {
  historyController.index(req, res);
});
app.get("/:id", async (req, res) => {
  historyController.index(req, res);
});

module.exports = app;
