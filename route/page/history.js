const express = require("express");
const auth = require("../../App/Middlewares/auth");
const HistoryController = require("../../app/controllers/HistoryController");

const app = express.Router();

const historyController = new HistoryController();

app.get("/", auth, async (req, res) => {
  historyController.index(req, res);
});
app.get("/:id", auth, async (req, res) => {
  historyController.index(req, res);
});

module.exports = app;
