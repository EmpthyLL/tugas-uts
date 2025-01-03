const express = require("express");
const auth = require("../../App/Middlewares/auth");
const { historyController } = require("../controllers");

const app = express.Router();

app.get("/", auth, async (req, res) => {
  historyController.index(req, res);
});
app.get("/:id", auth, async (req, res) => {
  historyController.index(req, res);
});

module.exports = app;
