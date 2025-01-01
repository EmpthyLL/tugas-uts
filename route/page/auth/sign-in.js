const LoginController = require("../../../app/controllers/LoginController");
const guest = require("../../../app/middlewares/guest");
const express = require("express");

const app = express.Router();

const loginController = new LoginController();

app.get("/", guest, (req, res) => {
  loginController.step = 0;
  loginController.index(req, res);
});
app.get("/verify-account", guest, (req, res) => {
  loginController.step = 1;
  registerController.otp = "";
  loginController.index(req, res);
});

app.post("/", guest, (req, res) => {
  loginController.login(req, res);
});
app.post("/verify-account", guest, (req, res) => {
  loginController.verify(req, res);
});

module.exports = app;
