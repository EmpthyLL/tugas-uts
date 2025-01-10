const Controller = require("./Controller");
const fs = require("fs");
const path = require("path");
const userModel = require("../../database/model/userModel");

class ProfileController extends Controller {
  constructor() {
    super();
    this.view = ["profile/profile", "auth/verify"];
    this.layout = "layout";
    this.title = [];
    this.step = 0;
    this.isEmail = false;
    this.isAuth = false;
  }
  async index(req, res) {
    try {
      this.user = await userModel.getUserByUUID(req.cookies.userId);
      this.title.push(this.user.fullname + " - Profile");
      this.title.push("Verify Number");
      this.title.push("Verify Email");
      const options = {
        layout: `components/${this.layout}`,
        title: this.title[this.step],
        req,
        success: req.flash("success") || [],
        error: req.flash("error") || [],
        isEmail: this.isEmail,
        isAuth: this.isAuth,
        no_hp: this.no_hp,
        email: this.email,
      };

      this.renderView(res, this.view[this.step], options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render profile page", 500);
    }
  }
  async verify(req, res) {
    if (this.isEmail) {
      this.email = req.body.email;
      const user = await userModel.getUserByEmail(this.email);
      if (!user) {
        res.redirect("/profile/verify-email");
      } else {
        req.flash("error", "Email address has been registered!");
        res.redirect("/profile");
      }
    } else {
      this.no_hp = req.body.no_hp;
      const user = await userModel.getUserByPhone(this.no_hp);
      if (!user) {
        res.redirect("/profile/verify-number");
      } else {
        req.flash("error", "Phone number has been registered!");
        res.redirect("/profile");
      }
    }
  }
  async editBiodata(req, res) {
    this.user = await userModel.getUserByUUID(req.cookies.userId);
    let newProfilePic = null;
    if (req.file) {
      newProfilePic = `/img/uploads/ProfilePic/${req.file.filename}`;

      if (this.user.profile_pic) {
        const oldImagePath = path.join(
          __dirname,
          "../../public/img/uploads/ProfilePic",
          path.basename(this.user.profile_pic)
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error("Failed to delete old profile picture:", err);
        });
      }
    }
    const data = {
      profile_pic: newProfilePic || this.user.profile_pic,
      fullname: req.body.fullname || this.user.fullname,
      gender: req.body.gender || this.user.gender,
      birth_date: req.body.birth_date || this.user.birth_date,
    };
    userModel.editBasicProfile(req.cookies.userId, data);
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
  }
  async editDataEmail(req, res) {
    this.email = req.body.email;
    userModel.editEmail(req.cookies.userId, this.email);
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
  }
  async editDataPhone(req, res) {
    this.no_hp = req.body.no_hp;
    userModel.editPhone(req.cookies.userId, this.no_hp);
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
  }
}

module.exports = ProfileController;
