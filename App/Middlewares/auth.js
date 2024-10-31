const jwt = require("jsonwebtoken");
const UserModel = require("../../model/service/UserModel");
const secretKey = "T0l0NGj4g4Rahasia";

const userModel = new UserModel();

async function auth(req, res, next) {
  // Check for token in cookies
  const token = req.cookies.token;

  req.isAuthenticated = false;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;
    const user = await userModel.getUserById(userId);

    if (!user) {
      return res.redirect("/register");
    }

    req.isAuthenticated = true;
    req.user = user;
    return next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = auth;
