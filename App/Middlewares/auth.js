const { decryptAccToken, handleTokenRefresh } = require("../../utils/jwt");
const userModel = require("../../database/model/userModel");
const { clearSession, setCookie } = require("../../utils/cookie");

const GUEST_ROUTES = ["/sign-in", "/register"];
const PUBLIC_ROUTES = ["/", "/search", "/about", "/category", "/product"];

function isRouteMatched(routeList, url) {
  return routeList.some((route) =>
    route === "/" ? url === route : url.startsWith(route)
  );
}

async function auth(req, res, next) {
  try {
    if (req.url.startsWith("/api")) {
      return next();
    }

    if (!req.cookies.userId) {
      clearSession(res);
      return handleUnauthenticated(req, res, next);
    }

    await userModel.cekMemberStatus(req.cookies.userId);
    const user = await userModel.getUserByUUID(req.cookies.userId);

    if (!user) {
      clearSession(res);
      return handleUnauthenticated(req, res, next);
    }

    const token = req.cookies.auth_token;
    req.isAuthenticated = false;

    if (!token) {
      const acc_token = await handleTokenRefresh(user);
      req.isAuthenticated = true;
      setCookie(res, "auth_token", acc_token, {
        maxAge: 15 * 60,
      });
      return next();
    }
    decryptAccToken(token);
    req.isAuthenticated = true;
    if (user.is_member && req.url === "/become-member") {
      return res.redirect("/");
    }
    handleGuestRoute(req, res, next);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        const acc_token = await handleTokenRefresh(user);
        req.isAuthenticated = true;
        setCookie(res, "auth_token", acc_token, {
          maxAge: 15 * 60,
        });
        if (user.is_member && req.url === "/become-member") {
          return res.redirect("/");
        }
        handleGuestRoute(req, res, next);
      } catch (refreshError) {
        if (refreshError.name === "TokenExpiredError") {
          await userModel.removeRefToken(req.cookies.userId);
          clearSession(res);
          handleUnauthenticated(req, res, next);
        } else {
          return res.status(401).redirect("/sign-in");
        }
      }
    } else {
      console.error("Authentication error:", error.message);
    }
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

  if (req.isAuthenticated && isGuestRoute) {
    return res.redirect("/");
  }

  return next();
}

module.exports = auth;
