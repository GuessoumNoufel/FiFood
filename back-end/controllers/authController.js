const JWT = require("jsonwebtoken");
const User = require("./../models/userModel");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const { promisify } = require("util");
const crypto = require("crypto");
const GoogleLoginCode = require("../models/GoogleLoginCode");
const {
  setAuthCookie,
  clearAuthCookie,
  getAuthToken,
} = require("../utils/authCookie");

exports.signup = async function (req, res, next) {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      country: req.body.country,
    });

    const token = JWT.sign(
      { id: newUser._id, tokenVersion: newUser.tokenVersion },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      },
    );
    setAuthCookie(res, token);

    newUser.password = undefined;

    res.status(201).json({ status: "success", user: newUser });
  } catch (err) {
    next(err);
  }
};

exports.login = catchAsync(async function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const email = String(req.body.email).trim().toLowerCase();
  const password = req.body.password;

  const user = await User.findOne({ email }).select("+password +tokenVersion");

  if (
    !user?.password ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(new AppError("Incorrect email or password!", 400));
  }

  const token = JWT.sign(
    { id: user.id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    },
  );
  setAuthCookie(res, token);

  res.status(200).json({
    status: "success",
    message: "user loged in successfully",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        country: user.country,
      },
    },
  });
});

exports.logout = catchAsync(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $inc: { tokenVersion: 1 } });
  }
  clearAuthCookie(res);
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});

exports.protect = catchAsync(async function (req, res, next) {
  const token = getAuthToken(req);
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401),
    );
  }

  let decoded;
  try {
    decoded = JWT.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid token! Please log in again", 401));
  }

  const user = await User.findById(decoded.id).select("+tokenVersion");
  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist",
        401,
      ),
    );
  }

  if (decoded.tokenVersion !== user.tokenVersion) {
    return next(
      new AppError("Your session has ended. Please log in again", 401),
    );
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed their password! Please log in again",
        401,
      ),
    );
  }
  req.user = user;
  next();
});

exports.optionalAuth = catchAsync(async function (req, res, next) {
  const token = getAuthToken(req);

  if (!token) {
    return next(); // no token — treat as a guest, don't block the request
  }

  let decoded;
  try {
    decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(); // invalid/expired token — still treat as a guest, don't block
  }

  const currentUser = await User.findById(decoded.id).select("+tokenVersion");
  if (!currentUser) {
    return next(); // user no longer exists — still treat as a guest
  }

  if (decoded.tokenVersion !== currentUser.tokenVersion) return next();

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(); // password changed since token issued — still treat as a guest
  }

  req.user = currentUser; // valid, logged-in user — attach and continue
  next();
});

exports.googleCallback = catchAsync(async (req, res) => {
  const code = crypto.randomBytes(32).toString("hex");
  await GoogleLoginCode.create({
    codeHash: crypto.createHash("sha256").update(code).digest("hex"),
    user: req.user._id,
    expiresAt: new Date(Date.now() + 60_000),
  });
  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(
    /\/$/,
    "",
  );
  res.redirect(`${clientUrl}/oauth-success?code=${code}`);
});

exports.exchangeGoogleCode = catchAsync(async (req, res, next) => {
  const code = typeof req.body.code === "string" ? req.body.code : "";
  if (!/^[a-f0-9]{64}$/.test(code)) {
    return next(new AppError("Google sign-in code is invalid or expired", 401));
  }

  const ticket = await GoogleLoginCode.findOneAndDelete({
    codeHash: crypto.createHash("sha256").update(code).digest("hex"),
    expiresAt: { $gt: new Date() },
  });
  if (!ticket) {
    return next(new AppError("Google sign-in code is invalid or expired", 401));
  }

  const user = await User.findById(ticket.user).select("+tokenVersion");
  if (!user) return next(new AppError("Account no longer exists", 401));

  const token = JWT.sign(
    { id: user._id, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
  );
  setAuthCookie(res, token);
  res.status(200).json({ status: "success" });
});

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: "success", data: { user: req.user } });
});
