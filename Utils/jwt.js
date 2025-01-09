const jwt = require("jsonwebtoken");
const userModel = require("../database/model/userModel");
require("dotenv").config();

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

async function handleTokenRefresh(req) {
  const userId = req.cookies.userId;
  if (!userId) {
    throw new Error("User ID not found in cookies");
  }
  const user = await userModel.getUserByUUID(userId);
  if (!user || !user.refresh_token) {
    throw new Error("User not found or missing refresh token");
  }

  decryptRefToken(user.refresh_token);

  const acc_token = generateAccToken({ uuid: userId });

  return acc_token;
}

module.exports = {
  generateAccToken,
  generateRefToken,
  decryptAccToken,
  decryptRefToken,
  handleTokenRefresh,
};
