const express = require("express");
const mealAPI_Controller = require("../controllers/mealAPI_controllers");
const authController = require("./../controllers/authController");
const router = express.Router();

router.get(
  "/discover/Random",
  authController.optionalAuth,
  mealAPI_Controller.discoverMeals,
  mealAPI_Controller.attachLikedStatus,
);
router.get("/discover/id/:id", mealAPI_Controller.getMealById);
router.get("/discover/name/:name", mealAPI_Controller.getMealByName);
router.get(
  "/discover/category/:category",
  authController.optionalAuth,
  mealAPI_Controller.getMealByCategory,
  mealAPI_Controller.attachLikedStatus,
);
router.get("/discover/area/:area", mealAPI_Controller.getMealByArea);

module.exports = router;
