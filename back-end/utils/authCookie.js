const COOKIE_NAME = "fifood_session";
const OAUTH_STATE_NAME = "fifood_oauth_state";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

const sameSite = ["lax", "strict", "none"].includes(
  (process.env.COOKIE_SAME_SITE || "lax").toLowerCase(),
)
  ? (process.env.COOKIE_SAME_SITE || "lax").toLowerCase()
  : "lax";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" || sameSite === "none",
  sameSite,
  path: "/api/v1",
};

exports.setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: SESSION_MS });
};

exports.clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
};

exports.getAuthToken = (req) => {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return cookie ? cookie.slice(COOKIE_NAME.length + 1) : null;
};

exports.setOAuthStateCookie = (res, state) => {
  res.cookie(OAUTH_STATE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
    path: "/api/v1/users/auth/google",
  });
};

exports.consumeOAuthState = (req, res) => {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${OAUTH_STATE_NAME}=`));
  const cookieState = cookie?.slice(OAUTH_STATE_NAME.length + 1) ?? "";
  const queryState = typeof req.query.state === "string" ? req.query.state : "";
  const valid = /^[a-f0-9]{64}$/.test(cookieState) &&
    /^[a-f0-9]{64}$/.test(queryState) &&
    require("crypto").timingSafeEqual(Buffer.from(cookieState), Buffer.from(queryState));

  res.clearCookie(OAUTH_STATE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/v1/users/auth/google",
  });
  return valid;
};
