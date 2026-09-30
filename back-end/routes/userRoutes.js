const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");
const { uploadUserImages } = require("../utils/multerConfig");
const passport = require("../utils/passportConfig");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  authController.googleCallback,
);
router.get("/me", authController.protect, authController.getMe);
router.get("/featured", userController.getFeaturedUsers);

// Profile and follow lists are public; following/unfollowing still requires auth.
router.get("/profile/:id", authController.optionalAuth, userController.getUserProfile);
router.get("/:id/recipes", authController.optionalAuth, userController.getUserRecipes);
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
