const Recipe = require("../models/recipeModel");
const AppError = require("./../utils/AppError");
const catchAsync = require("./../utils/catchAsync");
const { notifyFollowersOfNewRecipe } = require("../utils/newsletterService");
const { createRecipeNotifications } = require("../utils/inAppNotifications");

exports.getAllRecipes = catchAsync(async (req, res, next) => {
  const allowedFilters = ["title", "category", "area", "createdBy", "difficulty"];
  const queryObj = {};
  for (const field of allowedFilters) {
    const value = req.query[field];
    if (typeof value === "string" && value.length <= 200) queryObj[field] = value;
  }

  let query = Recipe.find(queryObj);
  const sortFields = new Set(["createdAt", "averageRating", "likesCount", "time", "title"]);
  const sortValue = typeof req.query.sort === "string" ? req.query.sort : "-createdAt";
  const sortField = sortValue.startsWith("-") ? sortValue.slice(1) : sortValue;
  query = query.sort(sortFields.has(sortField) ? sortValue : "-createdAt");

  const parsedPage = Number.parseInt(req.query.page, 10);
  const parsedLimit = Number.parseInt(req.query.limit, 10);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0
    ? Math.min(parsedPage, 10_000)
    : 1;
  const limit = Number.isSafeInteger(parsedLimit) && parsedLimit > 0
    ? Math.min(parsedLimit, 100)
    : 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);
  const recipes = await query;

  res.status(200).json({
    status: "success",
    results: recipes.length,
    data: recipes,
  });
});

exports.getRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id).populate(
    "createdBy",
    "name photo",
  );

  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: recipe,
  });
});

// exports.createRecipe = catchAsync(async (req, res, next) => {
//   const newRecipe = await Recipe.create({
//     title: req.body.title,
//     image: req.body.image,
//     category: req.body.category,
//     area: req.body.area,
//     description: req.body.description,
//     time: req.body.time,
//     servings: req.body.servings,
//     difficulty: req.body.difficulty,
//     instructions: req.body.instructions,
//     ingredients: req.body.ingredients,
//     createdBy: req.user.id,
//   });
//   res.status(201).json({
//     status: "success",
//     data: newRecipe,
//   });
// });
exports.createRecipe = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload a recipe image", 400));
  }

  const newRecipe = await Recipe.create({
    title: req.body.title,
    image: req.file.path, // full Cloudinary URL, ready to use directly
    category: req.body.category,
    area: req.body.area,
    description: req.body.description,
    time: req.body.time,
    servings: req.body.servings,
    difficulty: req.body.difficulty,
    instructions: req.body.instructions,
    ingredients: (() => {
      try {
        const ingredients = JSON.parse(req.body.ingredients);
        if (!Array.isArray(ingredients)) throw new Error("invalid list");
        return ingredients;
      } catch {
        throw new AppError("Ingredients must be a valid list", 400);
      }
    })(),
    createdBy: req.user.id,
  });
  void notifyFollowersOfNewRecipe(newRecipe);
  await createRecipeNotifications(newRecipe);
  res.status(201).json({ status: "success", data: newRecipe });
});

exports.updateRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  if (recipe.createdBy.toString() !== req.user.id) {
    return next(new AppError("You are not allowed to edit this recipe", 403));
  }

  const updates = {};
  const textFields = [
    "title",
    "category",
    "area",
    "description",
    "difficulty",
    "instructions",
  ];
  for (const field of textFields) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }

  for (const field of ["time", "servings"]) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field] === "" ? null : req.body[field];
    }
  }

  if (req.body.ingredients !== undefined) {
    try {
      updates.ingredients = Array.isArray(req.body.ingredients)
        ? req.body.ingredients
        : JSON.parse(req.body.ingredients);
    } catch {
      return next(new AppError("Ingredients must be a valid list", 400));
    }
    if (!Array.isArray(updates.ingredients)) {
      return next(new AppError("Ingredients must be a valid list", 400));
    }
  }

  if (req.file) updates.image = req.file.path;

  const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate("createdBy", "name photo");

  res.status(200).json({
    status: "success",
    data: updatedRecipe,
  });
});

exports.deleteRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new AppError("No recipe found with that ID", 404));
  }

  if (recipe.createdBy.toString() !== req.user.id) {
    return next(new AppError("You are not allowed to delete this recipe", 403));
  }

  await Recipe.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.rateRecipe = catchAsync(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    return next(new AppError("Recipe not found", 404));
  }

  const { value } = req.body;

  const numericValue = Number(value);
  if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 5) {
    return next(new AppError("Please provide a rating between 1 and 5", 400));
  }

  const existingRating = recipe.ratings.find(
    (r) => r.user.toString() === req.user.id,
  );

  if (existingRating) {
    existingRating.value = numericValue;
  } else {
    recipe.ratings.push({ value: numericValue, user: req.user.id });
  }

  const total = recipe.ratings.reduce((sum, r) => sum + r.value, 0);
  recipe.averageRating = total / recipe.ratings.length;

  await recipe.save();

  res.status(200).json({
    status: "success",
    message: "Rating saved successfully",
    data: recipe,
  });
});
