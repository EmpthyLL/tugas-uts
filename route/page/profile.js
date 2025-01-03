const express = require("express");
const auth = require("../../App/Middlewares/auth");
const upload = require("../../app/middlewares/upload");
const { profileController, registerController } = require("../controllers");

const app = express.Router();

const userPP = upload("ProfilePic");

app.get("/", auth, (req, res) => {
  profileController.step = 0;
  profileController.layout = "layout";
  profileController.index(req, res);
});
app.get("/verify-email", auth, (req, res) => {
  profileController.step = 1;
  registerController.step = 1;
  profileController.isEmail = true;
  profileController.layout = "plain";
  registerController.otp = "";
  profileController.index(req, res);
});
app.get("/verify-number", auth, (req, res) => {
  profileController.step = 1;
  profileController.isEmail = false;
  profileController.layout = "plain";
  registerController.otp = "";
  profileController.index(req, res);
});

app.put("/biodata", auth, userPP.single("profile_pic"), (req, res) => {
  profileController.editBiodata(req, res);
});
app.put("/verify-email", auth, (req, res) => {
  profileController.isEmail = true;
  profileController.verify(req, res);
});
app.put("/email", auth, (req, res) => {
  profileController.editDataEmail(req, res);
});
app.put("/verify-number", auth, (req, res) => {
  profileController.isEmail = false;
  profileController.verify(req, res);
});
app.put("/phone", auth, (req, res) => {
  profileController.editDataPhone(req, res);
});

module.exports = app;
