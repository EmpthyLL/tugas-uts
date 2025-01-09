const { decryptAccToken, handleTokenRefresh } = require("../../utils/jwt");
const userModel = require("../../database/model/userModel");
const { clearSession, setCookie } = require("../../utils/cookie");

async function cektoken(req, res, next) {
  try {
    if (!req.cookies.userId) {
      return res
        .status(403)
        .json({ message: "Token can not retrive any one token!" });
    }
    const token = req.cookies.auth_token;

    if (!token) {
      handleTokenRefresh(req);
      return next();
    }
    decryptAccToken(token);
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        const acc_token = await handleTokenRefresh(req);
        setCookie(res, "auth_token", acc_token, {
          maxAge: 15 * 60,
        });
        return next();
      } catch (refreshError) {
        if (refreshError.name === "TokenExpiredError") {
          await userModel.removeRefToken(req.cookies.userId);
          clearSession(res);
          return res
            .status(403)
            .json({ message: "Token can not be reffresh anymore!" });
        } else {
          return res.status(500).json({ message: refreshError.message });
        }
      }
    } else {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = cektoken;
