const express = require("express");
const { memberController } = require("../../controllers");

const app = express.Router();

app.get("/", (req, res) => {
  memberController.index(req, res);
});
app.post("/monthly", (req, res) => {
  memberController.month(req, res);
});
app.post("/yearly", (req, res) => {
  memberController.year(req, res);
});

module.exports = app;
