const jwt = require("jsonwebtoken");
const UserModel = require("../model/service/UserModel");
const SECRET_KEY = "T0l0NGj4g4Rahasia";

function getAuthUser(req) {
  try {
    const token = req.cookies.auth_token;
    const model = new UserModel();
    let user = "";

    if (token) {
      const { userId } = jwt.verify(token, SECRET_KEY);
      user = model.getUserByUuid(userId);
      return user;
    }

    return 0;
  } catch (error) {
    console.error("Failed to get authenticated user:", error.message);
  }
}

module.exports = getAuthUser;
