const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const { uploadUserImages } = require("../utils/multerConfig");
const passport = require("../utils/passportConfig");
const notificationController = require("../controllers/notificationController");
const rateLimit = require("../utils/rateLimit");
const crypto = require("crypto");
const {
  setOAuthStateCookie,
  consumeOAuthState,
} = require("../utils/authCookie");

const router = express.Router();

router.post(
  "/signup",
  rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: "Too many signup attempts. Try again later.",
  }),
  authController.signup,
);
router.post(
  "/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: "Too many login attempts. Try again later.",
  }),
  authController.login,
);
router.post("/auth/google/exchange", authController.exchangeGoogleCode);

router.get("/auth/google", (req, res, next) => {
  const state = crypto.randomBytes(32).toString("hex");
  setOAuthStateCookie(res, state);
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state,
  })(req, res, next);
});
router.get(
  "/auth/google/callback",
  (req, res, next) => {
    if (!consumeOAuthState(req, res)) {
      const clientUrl = (
        process.env.CLIENT_URL || "http://localhost:5173"
      ).replace(/\/$/, "");
      return res.redirect(`${clientUrl}/login?oauth=failed`);
    }
    next();
  },
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:5173"}/login`,
  }),
  authController.googleCallback,
);
router.get("/me", authController.protect, authController.getMe);
router.get("/featured", userController.getFeaturedUsers);

router.post("/logout", authController.optionalAuth, authController.logout);

// Profile and follow lists are public; following/unfollowing still requires auth.
router.get(
  "/profile/:id",
  authController.optionalAuth,
  userController.getUserProfile,
);
router.get(
  "/:id/recipes",
  authController.optionalAuth,
  userController.getUserRecipes,
);
router.get(
  "/:id/followers",
  authController.optionalAuth,
  userController.getUserFollowers,
);
router.get(
  "/:id/following",
  authController.optionalAuth,
  userController.getUserFollowing,
);

router.use(authController.protect);
router.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    message: "Too many account requests. Try again shortly.",
  }),
);

router.get("/notifications", notificationController.getMyNotifications);
router.patch(
  "/notifications/:id/read",
  notificationController.markNotificationRead,
);

router.get("/all", authController.protect, userController.getAllUsers);

router.post("/:id/follow", userController.toggleFollow);

router.patch("/updateMe", uploadUserImages, userController.updateMe);
router.patch("/updatePassword", userController.updatePassword);

module.exports = router;
