const express = require("express");
const mealAPI_Controller = require("../controllers/mealAPI_controllers");
const authController = require("./../controllers/authController");
const router = express.Router();
const rateLimit = require("../utils/rateLimit");
const mealApiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 90,
  message: "Too many recipe search requests. Try again shortly.",
});

router.get(
  "/discover/Random",
  mealApiRateLimit,
  authController.optionalAuth,
  mealAPI_Controller.discoverMeals,
  mealAPI_Controller.attachLikedStatus,
);
router.get("/discover/id/:id", mealApiRateLimit, mealAPI_Controller.getMealById);
router.get("/discover/name/:name", mealApiRateLimit, mealAPI_Controller.getMealByName);
router.get(
  "/discover/category/:category",
  mealApiRateLimit,
  authController.optionalAuth,
  mealAPI_Controller.getMealByCategory,
  mealAPI_Controller.attachLikedStatus,
);
router.get("/discover/area/:area", mealApiRateLimit, mealAPI_Controller.getMealByArea);

module.exports = router;
