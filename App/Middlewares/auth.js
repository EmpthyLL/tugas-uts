const jwt = require("jsonwebtoken");
const {
  decryptAccToken,
  decryptRefToken,
  generateAccToken,
} = require("../../utils/jwt");
const userModel = require("../../database/model/userModel");
const { setCookie, removeCookie } = require("../../utils/cookie");

async function auth(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    req.isAuthenticated = false;

    const publicRoutes = ["/", "/search", "/about", "/category", "/product"];
    const isPublicRoute = publicRoutes.some((route) =>
      req.url.startsWith(route)
    );

    if (!token) {
      if (!isPublicRoute) {
        return res.redirect("/login");
      }
      return next();
    }

    try {
      const { user } = decryptAccToken(token);
      req.isAuthenticated = true;
      req.user = user;
      return next();
    } catch (error) {
      if (error.name !== "TokenExpiredError") {
        console.error("Invalid access token:", error);
        return next();
      }
    }

    const user = await getUserData(req.cookies.userId);
    if (!user) {
      clearSession(res);
      return res.redirect("/login");
    }

    try {
      decryptRefToken(user.refresh_token);

      const acc_token = generateAccToken({
        user: {
          uuid: user.uuid,
          fullname: user.fullname,
          email: user.email,
          profile_pic: user.profile_pic,
          balance: user.balance,
          status_member: user.status_member,
          member_since: user.member_since,
        },
      });

      req.isAuthenticated = true;
      req.user = decryptAccToken(acc_token).user;
      setCookie(res, "auth_token", acc_token, { maxAge: 15 * 60 });
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        await userModel.removeRefToken(req.cookies.userId);
        clearSession(res);
        return res.redirect("/login");
      }
      console.error("Error verifying refresh token:", error);
    }

    return next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    return next();
  }
}

function clearSession(res) {
  removeCookie(res, "auth_token");
  removeCookie(res, "userId");
}

async function getUserData(userId) {
  if (!userId) return null;
  return userModel.getUserByUUID(userId);
}

module.exports = auth;
