const catchAsync = require("../utils/catchAsync");
const isLocalRecipeId = require("../utils/isValidID");
const Like = require("../models/likesModel");
const Recipe = require("../models/recipeModel");
const { fetchMealById } = require("./../utils/mealDB_API");
const AppError = require("./../utils/appError");

exports.toggleLike = catchAsync(async function (req, res, next) {
  const userId = req.user._id;
  const recipeId = req.params.id;
  const isLocalRecipe = isLocalRecipeId(recipeId);

  let like;
  if (isLocalRecipe) {
    like = await Like.findOne({ user: userId, localRecipeId: recipeId });
  } else {
    like = await Like.findOne({ user: userId, mealDBId: recipeId });
  }

  let likedRecipe;
  let message;

  if (like) {
    // toggle OFF — same delete logic works for both local and external,
    await Like.findOneAndDelete({ _id: like._id });
    message = "like removed";
  } else if (isLocalRecipe) {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return next(new AppError("no recipe with this id", 404));
    }
    likedRecipe = await Like.create({
      isLocalRecipe: true,
      user: userId,
      localRecipeId: recipe._id,
    });
    message = "added to likes";
  } else {
    const recipe = await fetchMealById(recipeId);
    if (!recipe) {
      return next(new AppError("no recipe with this id", 404));
    }
    likedRecipe = await Like.create({
      isLocalRecipe: false,
      user: userId,
      mealDBId: recipeId,
      title: recipe.title,
      image: recipe.image,
      category: recipe.category,
      area: recipe.area,
      instructions: recipe.instructions,
      ingredients: recipe.ingredients,
    });
    message = "added to likes";
  }

  res.status(200).json({
    status: "success",
    message,
    data: likedRecipe || null,
  });
});

exports.getFavorites = catchAsync(async function (req, res, next) {
  const favorites = await Like.find({ user: req.user._id })
    .populate({
      path: "localRecipeId",
      select: "title image category area ingredients createdBy likesCount",
    })
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: favorites.length,
    data: favorites,
  });
});

// exports.toggleLike = catchAsync(async function (req, res, next) {
//   const userId = req.user._id;
//   const recipeId = req.params.recipeId;
//   const isLocalRecipe = isLocalRecipeId(recipeId);
//   let likedRecipe;
//   let mssg;
//   if (isLocalRecipe) {
//     const like = await Like.findOne({ user: userId, localRecipeId: recipeId });
//   } else {
//     const like = await Like.findOne({ user: userId, mealDBId: recipeId });
//   }
//   if (like && isLocalRecipe) {
//     const deleted = await Like.findOneAndDelete({
//       user: userId,
//       localRecipeId: recipeId,
//     });
//     if (!deleted) {
//       return next(new AppError("no recipe with this id ", 403));
//     } else mssg = "liked deleted";
//   }
//   if (like && !isLocalRecipe) {
//     const deleted = await Like.findOneAndDelete({
//       user: userId,
//       mealDBId: recipeId,
//     });
//     if (!deleted) {
//       return next(new AppError("no recipe with this id ", 403));
//     } else {
//       mssg = "liked deleted";
//     }
//   }
//   if (!like && isLocalRecipe) {
//     const recipe = await Recipe.findById(recipeId);
//     if (recipe) {
//       const { createdBy, _id } = recipe;
//       likedRecipe = await Like.create({
//         isLocalRecipe: true,
//         user: createdBy,
//         _id,
//       });
//       mssg = "ad to liked";
//     } else {
//       return next(new AppError("no recipe with this id ", 403));
//     }
//   }
//   if (!like && !isLocalRecipe) {
//     const recipe = await fetchMealById(recipeId);
//     if (recipe) {
//       likedRecipe = await Like.create(recipe);
//       mssg = "ad to liked";
//     } else {
//       return next(new AppError("no recipe with this id ", 403));
//     }
//   }
//   res.status(200).json({ stauts: "succesed", message: mssg });
// });
