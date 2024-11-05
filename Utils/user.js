const jwt = require("jsonwebtoken");
const SECRET_KEY = "T0l0NGj4g4Rahasia";

function getAuthUser(req, res) {
  try {
    const token = req.cookies.auth_token;
    let user = "";

    if (token) {
      const { userId } = jwt.verify(token, SECRET_KEY);
      user = this.model.getUserByUuid(userId); // Ensure `this.model` is correctly defined in the calling context
    }

    return user;
  } catch (error) {
    console.error("Failed to get authenticated user:", error.message);
    throw new Error("Authentication failed.");
  }
}

module.exports = getAuthUser;
