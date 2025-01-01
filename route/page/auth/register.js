const RegisterController = require("../../../app/controllers/RegisterController");
const guest = require("../../../app/middlewares/guest");
const express = require("express");

const app = express.Router();

const registerController = new RegisterController();

app.get("/", guest, (req, res) => {
  res.redirect("/register/input-number");
});
app.get("/input-number", guest, (req, res) => {
  registerController.step = 0;
  registerController.no_hp = "";
  registerController.index(req, res);
});
app.get("/verify-number", guest, (req, res) => {
  registerController.step = 1;
  registerController.isEmail = false;
  registerController.otp = "";
  registerController.index(req, res);
});
app.get("/user-data", guest, (req, res) => {
  registerController.step = 2;
  registerController.email = "";
  registerController.index(req, res);
});
app.get("/verify-email", guest, (req, res) => {
  registerController.step = 3;
  registerController.isEmail = true;
  registerController.otp = "";
  registerController.index(req, res);
});

app.post("/input-number", guest, (req, res) => {
  registerController.step1(req, res);
});
app.post("/verify-number", guest, (req, res) => {
  registerController.step2(req, res);
});
app.post("/user-data", guest, (req, res) => {
  registerController.step3(req, res);
});
app.post("/verify-email", guest, (req, res) => {
  registerController.store(req, res);
});

module.exports = app;
