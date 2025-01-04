const jwt = require("jsonwebtoken");
const {
  decryptAccToken,
  decryptRefToken,
  generateAccToken,
} = require("../../utils/jwt");
const userModel = require("../../database/model/userModel");
const { removeCookie } = require("../../utils/cookie");

async function auth(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    console.log(req.cookies);
    req.isAuthenticated = false;

    if (!token) {
      if (
        req.url !== "/" &&
        !req.url.startsWith("/search") &&
        !req.url.startsWith("/about") &&
        !req.url.startsWith("/category") &&
        !req.url.startsWith("/product")
      ) {
        res.redirect("/");
      }
      return next();
    }
    const { user } = decryptAccToken(token);
    req.isAuthenticated = true;
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      const {
        fullname,
        email,
        profile_pic,
        refresh_token,
        balance,
        status_member,
        member_since,
      } = await userModel.getUserByUUID(req.cookies.userId);
      try {
        decryptRefToken(refresh_token);
        req.isAuthenticated = true;
        const acc_token = generateAccToken({
          user: {
            uuid: req.cookies.userId,
            fullname,
            email,
            profile_pic,
            balance,
            status_member,
            member_since,
          },
        });
        const { user } = decryptAccToken(acc_token);
        req.user = user;
        setCookie(res, "auth_token", acc_token, { maxAge: 15 * 60 });
        next();
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          userModel.removeRefToken(req.cookies.userId);
          removeCookie(res, "auth_token");
          removeCookie(res, "userId");
          res.redirect("/login");
        }
        return next();
      }
    }
    console.error("Token verification error:", error);
    return next();
  }
}

module.exports = auth;
