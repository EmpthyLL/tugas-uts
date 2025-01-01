const jwt = require("jsonwebtoken");

const ACCESS_KEY = process.env.ACCESS_KEY;
const REFRESH_KEY = process.env.REFRESH_KEY;

function generateAccToken(data) {
  return jwt.sign(data, ACCESS_KEY, {
    expiresIn: "15m",
  });
}
function generateRefToken(data) {
  return jwt.sign(data, REFRESH_KEY, {
    expiresIn: "7d",
  });
}
function decryptAccToken(token) {
  return jwt.verify(token, ACCESS_KEY);
}
function decryptRefToken(token) {
  return jwt.verify(token, REFRESH_KEY);
}

module.exports = {
  generateAccToken,
  generateRefToken,
  decryptAccToken,
  decryptRefToken,
};
