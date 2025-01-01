const jwt = require("jsonwebtoken");
const SECRET_KEY = "T0l0NGj4g4Rahasia";

async function cektoken(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    req.isAuthenticated = false;
    if (!token) {
      return res.status(403).json({ message: "Token was not provided!" });
    }

    jwt.verify(token, SECRET_KEY);

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token was expired!" });
    }
    return res.status(500).json({ message: "Something went wrong!" });
  }
}

module.exports = cektoken;
