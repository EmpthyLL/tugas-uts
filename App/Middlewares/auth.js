const jwt = require("jsonwebtoken");
const isMember = require("../../utils/ismember");
const SECRET_KEY = "T0l0NGj4g4Rahasia";

async function auth(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    req.isAuthenticated = false;

    if (!token) {
      if (req.url.startsWith("/profile")) {
        res.redirect("/");
      }
      return next();
    }

    const { userId } = jwt.verify(token, SECRET_KEY);
    isMember(userId);
    req.isAuthenticated = true;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next();
    }
    console.error("Token verification error:", error);
    return next();
  }
}

module.exports = auth;
