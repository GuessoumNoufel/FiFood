// const Recipe = require("../models/recipeModel");
const express = require("express");
const recipeController = require("../controllers/recipeController");
const authController = require("../controllers/authController");
const { uploadRecipeImage } = require("../utils/multerConfig");

const router = express.Router();

router.get("/", recipeController.getAllRecipes);
router.get("/:id", recipeController.getRecipe);

router.use(authController.protect);

// router.post("/createRecipe", recipeController.createRecipe);
router.post("/createRecipe", uploadRecipeImage, recipeController.createRecipe);
router.patch(
  "/updateRecipe/:id",
  uploadRecipeImage,
  recipeController.updateRecipe,
);
router.delete("/deleteRecipe/:id", recipeController.deleteRecipe);
router.patch("/rate/:id", recipeController.rateRecipe);
module.exports = router;
