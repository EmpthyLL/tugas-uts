const express = require("express");
const LoginController = require("../../app/controllers/LoginController");
const RegisterController = require("../../app/controllers/RegisterController");

const app = express.Router();

const registerController = new RegisterController();
const loginController = new LoginController();

app.post("/login", (req, res) => {});
app.post("/register", (req, res) => {});
app.get("/sendOTP", (req, res) => {
  registerController.sendOTP();
});
app.get("/verifyOTP", (req, res) => {
  registerController.verifyOTP();
});
app.post("/refresh", (req, res) => {});
app.post("/logout", (req, res) => {
  loginController.logout(req, res);
});

module.exports = app;
