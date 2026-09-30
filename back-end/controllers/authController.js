const JWT = require("jsonwebtoken");
const User = require("./../models/userModel");
const AppError = require("./../utils/AppError");
const catchAsync = require("./../utils/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

exports.signup = async function (req, res, next) {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      country: req.body.country,
    });

    const token = JWT.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    newUser.password = undefined;

    res.status(201).json({ status: "success", user: newUser, token });
  } catch (err) {
    next(err);
  }
};

exports.login = catchAsync(async function (req, res, next) {
  if (!req.body.email || !req.body.password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 400));
  }

  const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    message: "user loged in successfully",
    token,
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

exports.logout = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

exports.protect = catchAsync(async function (req, res, next) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401),
    );
  }

  const token = req.headers.authorization.split(" ")[1];

  let decoded;
  try {
    decoded = JWT.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid token! Please log in again", 401));
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist",
        401,
      ),
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
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(); // no token — treat as a guest, don't block the request
  }

  let decoded;
  try {
    decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(); // invalid/expired token — still treat as a guest, don't block
  }

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(); // user no longer exists — still treat as a guest
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(); // password changed since token issued — still treat as a guest
  }

  req.user = currentUser; // valid, logged-in user — attach and continue
  next();
});

exports.googleCallback = (req, res) => {
  const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Redirect to the frontend with the token in the URL — the frontend reads and stores it.
  res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
};

exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({ status: "success", data: { user: req.user } });
});
