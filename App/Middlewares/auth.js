const jwt = require("jsonwebtoken");
const UserModel = require("../../model/service/UserModel");
const secretKey = "T0l0NGj4g4Rahasia";

const userModel = new UserModel();

async function auth(req, res, next) {
  const token = req.session?.token;

  req.isAuthenticated = false;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    const user = await userModel.getUserById(userId);
    if (!user) {
      return next();
    }

    req.user = user;
    req.isAuthenticated = true;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Session expired or invalid token. Please log in again.",
    });
  }
}

module.exports = auth;
