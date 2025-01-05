const express = require("express");
const { registerController } = require("../../controllers");

const app = express.Router();

app.get("/", (req, res) => {
  res.redirect("/register/input-number");
});
app.get("/input-number", (req, res) => {
  registerController.step = 0;
  registerController.no_hp = "";
  registerController.index(req, res);
});
app.get("/verify-number", (req, res) => {
  registerController.step = 1;
  registerController.isEmail = false;
  registerController.otp = "";
  registerController.index(req, res);
});
app.get("/user-data", (req, res) => {
  registerController.step = 2;
  registerController.email = "";
  registerController.index(req, res);
});
app.get("/verify-email", (req, res) => {
  registerController.step = 3;
  registerController.isEmail = true;
  registerController.otp = "";
  registerController.index(req, res);
});

app.post("/input-number", (req, res) => {
  registerController.step1(req, res);
});
app.post("/verify-number", (req, res) => {
  registerController.step2(req, res);
});
app.post("/user-data", (req, res) => {
  registerController.step3(req, res);
});
app.post("/verify-email", (req, res) => {
  registerController.store(req, res);
});

module.exports = app;
