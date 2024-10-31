const jwt = require("jsonwebtoken");
const secretKey = "T0l0NGj4g4Rahasia";

function guest(req, res, next) {
  const token = req.cookies.auth_token;

  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, secretKey);
    res.redirect("/");
  } catch (error) {
    return next();
  }
}

module.exports = guest;
