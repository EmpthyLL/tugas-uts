const express = require("express");
const { registerController, loginController } = require("../../controllers");

const app = express.Router();

app.get("/", (req, res) => {
  loginController.step = 0;
  loginController.index(req, res);
});
app.get("/verify-account", (req, res) => {
  loginController.step = 1;
  registerController.otp = "";
  if (!loginController.no_hp) {
    res.redirect("/sign-in");
  }
  loginController.index(req, res);
});

app.post("/", (req, res) => {
  loginController.login(req, res);
});
app.post("/verify-account", (req, res) => {
  loginController.verify(req, res);
});

module.exports = app;
