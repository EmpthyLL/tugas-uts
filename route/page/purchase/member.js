const express = require("express");
const auth = require("../../../app/middlewares/auth");
const { memberController } = require("../../controllers");

const app = express.Router();

app.get("/", auth, (req, res) => {
  memberController.index(req, res);
});
app.post("/monthly", auth, (req, res) => {
  memberController.month(req, res);
});
app.post("/yearly", auth, (req, res) => {
  memberController.year(req, res);
});

module.exports = app;
