const jwt = require("jsonwebtoken");
const UserModel = require("../model/service/UserModel");
const SECRET_KEY = "T0l0NGj4g4Rahasia";

function getAuthUser(req, res, direct) {
  try {
    const token = req.cookies.auth_token;
    const model = new UserModel();
    let user = "";

    if (token) {
      const { userId } = jwt.verify(token, SECRET_KEY);
      user = model.getUserByUuid(userId);
      model.checkMembership(user.uuid);
      return user;
    }
    if (direct) {
      return res.redirect("/sign-in");
    }
    return 0;
  } catch (error) {
    console.error("Failed to get authenticated user:", error.message);
  }
}

module.exports = getAuthUser;
