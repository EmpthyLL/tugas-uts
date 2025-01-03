const cookie = require("cookie");

function setCookie(res, name, values, options = {}) {
  const cookieOptions = {
    httpOnly: true,
    maxAge: options.maxAge || 60 * 60,
    path: options.path || "/",
    secure: process.env.NODE_ENV === "production",
    ...options,
  };

  const serializedCookie = cookie.serialize(name, values, cookieOptions);
  res.setHeader("Set-Cookie", serializedCookie);
}

function removeCookie(res, name, options = {}) {
  const cookieOptions = {
    httpOnly: true,
    maxAge: 0,
    path: options.path || "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: options.sameSite || "Lax",
  };

  const serializedCookie = cookie.serialize(name, "", cookieOptions);
  res.setHeader("Set-Cookie", serializedCookie);
}

module.exports = { setCookie, removeCookie };
