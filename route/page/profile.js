const express = require("express");
const upload = require("../../app/middlewares/upload");
const { profileController, registerController } = require("../controllers");

const app = express.Router();

const userPP = upload("ProfilePic");

app.get("/", (req, res) => {
  profileController.step = 0;
  profileController.layout = "layout";
  profileController.index(req, res);
});
app.get("/verify-email", (req, res) => {
  profileController.step = 1;
  profileController.isEmail = true;
  profileController.layout = "plain";
  registerController.otp = "";
  if (!profileController.email) {
    res.redirect("/profile");
  }
  profileController.index(req, res);
});
app.get("/verify-number", (req, res) => {
  profileController.step = 1;
  profileController.isEmail = false;
  profileController.layout = "plain";
  registerController.otp = "";
  if (!profileController.no_hp) {
    res.redirect("/profile");
  }
  profileController.index(req, res);
});

app.put("/biodata", userPP.single("profile_pic"), (req, res) => {
  profileController.editBiodata(req, res);
});
app.put("/verify-email", (req, res) => {
  profileController.isEmail = true;
  profileController.verify(req, res);
});
app.put("/email", (req, res) => {
  profileController.editDataEmail(req, res);
});
app.put("/verify-number", (req, res) => {
  profileController.isEmail = false;
  profileController.verify(req, res);
});
app.put("/phone", (req, res) => {
  profileController.editDataPhone(req, res);
});

module.exports = app;
