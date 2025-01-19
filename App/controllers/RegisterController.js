const notifModel = require("../../database/model/notifModel");
const userModel = require("../../database/model/userModel");
const { setCookie } = require("../../utils/cookie");
const Controller = require("./Controller");

class RegisterController extends Controller {
  constructor() {
    super();
    this.view = [
      "auth/input_phone",
      "auth/verify",
      "auth/user_data",
      "auth/verify",
    ];
    this.layout = "plain";
    this.title = ["Input Phone", "Verify Number", "User Data", "Verify Email"];
    this.step = 0;
    this.isEmail = false;
  }

  index(req, res) {
    try {
      const options = {
        layout: `components/${this.layout}`,
        title: this.title[this.step],
        errors: req.flash("errors") || [],
        no_hp: this.no_hp,
        otp: this.otp,
        req,
        fullname: this.fullname,
        email: this.email,
        login: false,
        isAuth: true,
        isEmail: this.email,
      };
      this.renderView(res, this.view[this.step], options);
    } catch (error) {
      console.log(error);
      this.handleError(res, "Failed to render register page", 500);
    }
  }

  sendOTP(req, res) {
    if (req.cookies.userId && req.url.startsWith("/profile")) {
      return res
        .status(401)
        .json({ message: "OTP is not allowed to be generate." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 5 * 60 * 1000;
    this.otp = otp;
    this.otpExpiration = expirationTime;
    return res.status(200).json({
      message: "OTP is generated",
      otp,
    });
  }

  verifyOTP(req, res) {
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({
        message: "Please enter the OTP sent to you.",
      });
    }
    if (!this.otp || !this.otpExpiration) {
      return res
        .status(400)
        .json({ message: "OTP has not been generated yet." });
    }
    if (Date.now() > this.otpExpiration) {
      this.otp = null;
      this.otpExpiration = null;
      return res.status(400).json({ message: "OTP has expired." });
    }
    if (otp !== this.otp) {
      return res.status(401).json({
        message: "Invalid OTP. Please try again.",
      });
    }
    this.otp = null;
    this.expirationTime = null;
    return res.status(200).json({ message: "OTP verified successfully!" });
  }

  async step1(req, res) {
    this.no_hp = req.body.no_hp;
    try {
      const user = await userModel.getUserByPhone(this.no_hp);
      if (user) {
        throw new Error("Phone number is already registered.");
      }
      res.setHeader("Location", "/register/verify-number");
      res.status(302).send();
    } catch (error) {
      req.flash("errors", [{ msg: error.message }]);
      res.setHeader("Location", "/register");
      res.status(302).send();
    }
  }

  step2(req, res) {
    this.no_hp = req.body.no_hp;
    res.setHeader("Location", "/register/user-data");
    res.status(302).send();
  }

  step3(req, res) {
    this.email = req.body.email;
    this.fullname = req.body.fullname;
    this.no_hp = req.body.no_hp;
    res.setHeader("Location", "/register/verify-email");
    res.status(302).send();
  }

  async store(req, res) {
    try {
      this.email = req.body.email;
      this.fullname = req.body.fullname;
      this.no_hp = req.body.no_hp;

      const { uuid, acc_token } = await userModel.register(
        this.fullname,
        this.no_hp,
        this.email
      );

      setCookie(res, "auth_token", acc_token, { maxAge: 15 * 60 });
      setCookie(res, "userId", uuid, { maxAge: 7 * 60 * 60 * 24 });

      const message = {
        title: `Wellcome, ${full_name}!`,
        body: "Explore our deals and enjoy shopping with us.",
        navigate: "/",
        category: "common",
        type: "register",
      };
      await notifModel.addNotif(req.cookies.userId, message);

      res.redirect(`/`);
    } catch (error) {
      req.flash("errors", [{ msg: error.message }]);
      console.log(error);
      res.setHeader("Location", "/register/user-data");
      res.status(302).send();
    }
  }
}

module.exports = RegisterController;
