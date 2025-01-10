const express = require("express");
const { registerController, loginController } = require("../controllers");

const app = express.Router();

app.get("/sendOTP", (req, res) => {
  registerController.sendOTP(req, res);
});
app.post("/verifyOTP", (req, res) => {
  registerController.verifyOTP(req, res);
});
app.post("/logout", (req, res) => {
  loginController.logout(req, res);
});

module.exports = app;
