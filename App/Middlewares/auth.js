const jwt = require("jsonwebtoken");
const SECRET_KEY = "T0l0NGj4g4Rahasia";

async function auth(req, res, next) {
  try {
    const token = req.cookies.auth_token;
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
    const { userId } = jwt.verify(token, SECRET_KEY);
    req.userid = userId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.redirect("/login");
      return next();
    }
    console.error("Token verification error:", error);
    return next();
  }
}

module.exports = auth;
