const jwt = require("jsonwebtoken");
const {
  decryptAccToken,
  decryptRefToken,
  generateAccToken,
} = require("../../utils/jwt");
const userModel = require("../../database/model/userModel");
const { setCookie, removeCookie } = require("../../utils/cookie");

const PUBLIC_ROUTES = ["/", "/search", "/about", "/category", "/product"];

async function auth(req, res, next) {
  try {
    const token = req.cookies.auth_token;
    req.isAuthenticated = false;

    if (!token) {
      return handleUnauthenticated(req, res, next);
    }

    const { user } = decryptAccToken(token);
    req.isAuthenticated = true;
    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        await handleTokenRefresh(req, res);
        return next();
      } catch (refreshError) {
        if (refreshError.name === "TokenExpiredError") {
          await userModel.removeRefToken(req.cookies.userId);
          clearSession(res);
          return res.redirect("/login");
        }
        console.error("Error verifying refresh token:", refreshError);
      }
    }
    console.error("Authentication error:", error);
    return res.redirect("/login");
  }
}

function handleUnauthenticated(req, res, next) {
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    req.url.startsWith(route)
  );

  if (req.cookies.userId) {
    return handleTokenRefresh(req, res)
      .then(next)
      .catch(() => {
        clearSession(res);
        if (!isPublicRoute) return res.redirect("/login");
        return next();
      });
  }

  if (!isPublicRoute) {
    clearSession(res);
    return res.redirect("/login");
  }

  return next();
}

function clearSession(res) {
  removeCookie(res, "auth_token");
  removeCookie(res, "userId");
}

async function getUserData(userId) {
  if (!userId) return null;
  return userModel.getUserByUUID(userId);
}

async function handleTokenRefresh(req, res) {
  const userId = req.cookies.userId;
  const user = await getUserData(userId);

  if (!user) {
    clearSession(res);
    throw new Error("User not found");
  }

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
  setCookie(res, "auth_token", acc_token, {
    maxAge: 15 * 60,
  });
}

module.exports = auth;
