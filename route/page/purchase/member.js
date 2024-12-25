const express = require("express");
const auth = require("../../../App/Middlewares/auth");
const MemberController = require("../../../app/controllers/MemberController");

const app = express.Router();

const memberController = new MemberController();

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
