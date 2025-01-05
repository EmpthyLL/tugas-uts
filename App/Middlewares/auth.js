const jwt = require("jsonwebtoken");
const {
  decryptAccToken,
  decryptRefToken,
  generateAccToken,
} = require("../../utils/jwt");
const userModel = require("../../database/model/userModel");
const { setCookie, removeCookie } = require("../../utils/cookie");

const GUEST_ROUTES = ["/sign-in", "/register"];
const PUBLIC_ROUTES = ["/", "/search", "/about", "/category", "/product"];

function isRouteMatched(routeList, url) {
  return routeList.some((route) => {
    if (route === "/") {
      return url === route;
    }
    return url.startsWith(route);
  });
}

async function auth(req, res, next) {
  try {
    if (req.url.startsWith("/api")) {
      return next();
    }

    if (!req.cookies.userId) {
      return handleUnauthenticated(req, res, next);
    }

    const token = req.cookies.auth_token;
    req.isAuthenticated = false;

    if (!token) {
      await handleTokenRefresh(req, res);
    }

    decryptAccToken(token);
    req.isAuthenticated = true;
    handleGuestRoute(req, res, next);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        await handleTokenRefresh(req, res);
        return next();
      } catch (refreshError) {
        if (refreshError.name === "TokenExpiredError") {
          await userModel.removeRefToken(req.cookies.userId);
          clearSession(res);
          return res.status(401).redirect("/sign-in");
        }
        console.error("Error verifying refresh token:", refreshError.message);
      }
    }
    console.error("Authentication error:", error.message);
    return res.status(401).redirect("/sign-in");
  }
}

async function handleUnauthenticated(req, res, next) {
  const isGuestRoute = isRouteMatched(GUEST_ROUTES, req.url);
  const isPublicRoute = isRouteMatched(PUBLIC_ROUTES, req.url);
  if (!isGuestRoute && !isPublicRoute) {
    return res.status(401).redirect("/sign-in");
  }
  return next();
}

function handleGuestRoute(req, res, next) {
  const isGuestRoute = isRouteMatched(GUEST_ROUTES, req.url);

  if (isGuestRoute) {
    return res.redirect("/");
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

async function handleTokenRefresh(req, res, next) {
  const userId = req.cookies.userId;
  if (!userId) {
    throw new Error("User ID not found in cookies");
  }

  const user = await getUserData(userId);
  if (!user || !user.refresh_token) {
    throw new Error("User not found or missing refresh token");
  }

  decryptRefToken(user.refresh_token);

  const acc_token = generateAccToken({ uuid: userId });

  req.isAuthenticated = true;
  setCookie(res, "auth_token", acc_token, {
    maxAge: 15 * 60,
  });
  return next();
}

module.exports = auth;
