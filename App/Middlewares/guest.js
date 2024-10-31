const jwt = require("jsonwebtoken");
const secretKey = "T0l0NGj4g4Rahasia";

function guest(req, res, next) {
  const token = req.session?.token;

  if (!token) {
    return next();
  }

  try {
    jwt.verify(token, secretKey);
    return res.status(403).json({ message: "You are already logged in." });
  } catch (error) {
    return next();
  }
}

module.exports = guest;
