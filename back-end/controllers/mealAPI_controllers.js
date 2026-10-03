const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const axios = require("axios");
const Like = require("../models/likesModel");
const { fetchMealById } = require("./../utils/mealDB_API");
const { searchMealsByName } = require("./../utils/mealDB_API");
const { filterMealsByCategory } = require("./../utils/mealDB_API");
const { filterMealsByArea } = require("./../utils/mealDB_API");

const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
let mealsCache = [];
let nextLetterIndex = 0;

const fetchNextLetterGroup = async () => {
  const groupLetters = alphabet.slice(nextLetterIndex, nextLetterIndex + 2);

  for (const letter of groupLetters) {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`,
    );

    const meals = response.data.meals;
    if (!meals) continue; // this letter has zero matches

    const lightMeals = meals.map((meal) => ({
      mealDBId: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
    }));

    mealsCache.push(...lightMeals);
  }

  nextLetterIndex += 2;
};

exports.discoverMeals = catchAsync(async function (req, res, next) {
  const page = req.query.page * 1 || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  while (
    mealsCache.length < skip + limit &&
    nextLetterIndex < alphabet.length
  ) {
    await fetchNextLetterGroup();
  }

  res.locals.pageResults = mealsCache.slice(skip, skip + limit);
  next();

  // const pageResults = mealsCache.slice(skip, skip + limit);

  // res.status(200).json({
  //   status: "success",
  //   results: pageResults.length,
  //   totalMealsFetchedSoFar: mealsCache.length,
  //   data: pageResults,
  // });
});

exports.attachLikedStatus = catchAsync(async function (req, res, next) {
  if (!req.user) {
    return res.status(200).json({
      status: "success",
      results: res.locals.pageResults.length,
      ...(res.locals.totalResults === undefined
        ? {}
        : { totalResults: res.locals.totalResults }),
      data: res.locals.pageResults,
    });
  }

  const mealDBIds = res.locals.pageResults.map((meal) => meal.mealDBId);
  const likedDocs = await Like.find({
    user: req.user._id,
    mealDBId: { $in: mealDBIds },
  }).select("mealDBId");

  res.status(200).json({
    status: "success",
    results: res.locals.pageResults.length,
    ...(res.locals.totalResults === undefined
      ? {}
      : { totalResults: res.locals.totalResults }),
    likedMealIds: likedDocs.map((doc) => doc.mealDBId),
    data: res.locals.pageResults,
  });
});

exports.getMealById = catchAsync(async function (req, res, next) {
  const meal = await fetchMealById(req.params.id);
  if (!meal) return next(new AppError("No meal found with that ID", 404));
  res.status(200).json({ status: "success", data: meal });
});

// exports.getMealByName = catchAsync(async function (req, res, next) {
//   const meals = await searchMealsByName(req.params.name);
//   if (!meals) return next(new AppError("No meals found with that name", 404));
//   res
//     .status(200)
//     .json({ status: "success", results: meals.length, data: meals });
// });
exports.getMealByName = catchAsync(async function (req, res, next) {
  const meals = await searchMealsByName(req.params.name);

  if (!meals) {
    return next(new AppError("No meals found with that name", 404));
  }

  const page = req.query.page * 1 || 1;
  const limit = 15;
  const skip = (page - 1) * limit;
  const pageResults = meals.slice(skip, skip + limit);

  res.status(200).json({
    status: "success",
    results: pageResults.length,
    totalResults: meals.length,
    data: pageResults,
  });
});

exports.getMealByCategory = catchAsync(async function (req, res, next) {
  const meals = (await filterMealsByCategory(req.params.category)) ?? [];

  const page = req.query.page * 1 || 1;
  const limit = 15;
  const skip = (page - 1) * limit;
  res.locals.pageResults = meals.slice(skip, skip + limit);
  res.locals.totalResults = meals.length;
  next();
});

exports.getMealByArea = catchAsync(async function (req, res, next) {
  const meals = await filterMealsByArea(req.params.area);
  if (!meals) return next(new AppError("No meals found in that area", 404));
  res
    .status(200)
    .json({ status: "success", results: meals.length, data: meals });
});
