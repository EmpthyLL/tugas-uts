const UserModel = require("../../model/service/UserModel");
const formatDate = require("../../utils/formateDate");
const getAuthUser = require("../../utils/user");
const Controller = require("./Controller");
const fs = require("fs");
const path = require("path");

class ProfileController extends Controller {
  constructor() {
    super();
    this.view = ["profile/profile", "auth/verify"];
    this.layout = "layout";
    this.title = [];
    this.user = {};
    this.step = 0;
    this.model = new UserModel();
    this.no_hp = "";
    this.email = "";
    this.isEmail = false;
  }
  index(req, res) {
    try {
      this.user = getAuthUser(req, res, false);
      this.title.push(this.user.fullname + " - Profile");
      this.title.push("Verify Number");
      this.title.push("Verify Email");
      console.log(this.user);
      const options = {
        layout: `components/${this.layout}`,
        title: this.title[this.step],
        req,
        success: req.flash("success") || [],
        error: req.flash("error") || [],
        menus: this.menus,
        keyword: "",
        user: this.user,
        isAuth: false,
        isEmail: this.isEmail,
        no_hp: this.no_hp,
        email: this.email,
        formatDate,
        cart: this.user.cart,
      };

      this.renderView(res, this.view[this.step], options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render profile page", 500);
    }
  }
  verify(req, res) {
    if (this.isEmail) {
      this.email = req.body.email;
      if (this.model.isEmailUnique(this.email)) {
        res.redirect("/profile/verify-email");
      } else {
        req.flash("error", "Email address has been registered!");
        res.redirect("/profile");
      }
    } else {
      this.no_hp = req.body.no_hp;
      if (this.model.isPhoneUnique(this.no_hp)) {
        res.redirect("/profile/verify-number");
      } else {
        req.flash("error", "Phone number has been registered!");
        res.redirect("/profile");
      }
    }
  }
  editBiodata(req, res) {
    this.user = getAuthUser(req, res, false);
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
      profile_pic: newProfilePic,
      fullname: req.body.fullname || null,
      gender: req.body.gender || null,
      birth_date: req.body.birth_date || null,
    };
    this.model.editBasicInfo(this.user.uuid, data);
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
  }
  editDataEmail(req, res) {
    this.user = getAuthUser(req, res, false);
    this.email = req.body.email;
    this.model.editEmail(this.user.uuid, this.email);
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
  }
  editDataPhone(req, res) {
    this.user = getAuthUser(req, res, false);
    this.no_hp = req.body.no_hp;
    this.model.editPhone(this.user.uuid, this.no_hp);
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
  }
}

module.exports = ProfileController;
