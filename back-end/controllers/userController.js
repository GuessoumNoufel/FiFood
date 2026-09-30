const filteredObj = require("./../utils/filterObj");
const JWT = require("jsonwebtoken");
const User = require("./../models/userModel");
const AppError = require("./../utils/AppError");
const catchAsync = require("./../utils/catchAsync");
const Recipe = require("../models/recipeModel");
const mongoose = require("mongoose");

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for password updates. Use /updatePassword.",
        400,
      ),
    );
  }

  const filteredBody = filteredObj(req.body, "name", "email", "bio", "country");

  if (req.files?.photo) {
    filteredBody.photo = req.files.photo[0].path;
  } else if (req.body.removePhoto === "true") {
    filteredBody.photo =
      "https://res.cloudinary.com/clvbhmja/image/upload/v1789888038/default-profile-img.jpg";
  }

  if (req.files?.coverImage) {
    filteredBody.coverImage = req.files.coverImage[0].path;
  } else if (req.body.removeCoverImage === "true") {
    filteredBody.coverImage =
      "https://res.cloudinary.com/clvbhmja/image/upload/v1789888039/default-cover-img.png";
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });
  // console.log("user id :", req.user._id);
  // console.log("req body :", req.body);
  // console.log("filterd body :", filteredBody);

  res.status(200).json({ status: "success", data: updatedUser });
  console.log(updatedUser);
});

exports.updatePassword = catchAsync(async function (req, res, next) {
  if (
    !req.body.password ||
    !req.body.newPassword ||
    !req.body.newPasswordConfirm
  ) {
    return next(
      new AppError(
        "Please provide your current password, new password and confirm new password",
        401,
      ),
    );
  }

  if (req.body.newPassword !== req.body.newPasswordConfirm) {
    return next(new AppError("The new passwords do not match", 400));
  }

  if (req.body.newPassword.length < 8 || req.body.newPassword.length > 40) {
    return next(
      new AppError("The new password must be between 8 and 40 characters", 400),
    );
  }

  const user = await User.findById({ _id: req.user._id }).select("+password");
  if (!user.password) {
    return next(
      new AppError(
        "This account does not have a password. Use your sign-in provider to manage it.",
        400,
      ),
    );
  }
  const correctPassword = await user.correctPassword(
    req.body.password,
    user.password,
  );
  if (!correctPassword) {
    return next(new AppError("Your current password is incorrect", 401));
  }
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.newPasswordConfirm;
  await user.save();

  const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    token,
  });
});

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "name bio photo coverImage country followersCount followingCount createdAt",
  );
  if (!user) return next(new AppError("No user found with that ID", 404));

  const recipesCount = await Recipe.countDocuments({ createdBy: user._id });
  const profile = user.toObject();
  profile.amFollowing = Boolean(
    req.user?.following.some((followingId) =>
      followingId.equals(user._id),
    ),
  );

  res.status(200).json({
    status: "success",
    data: { user: profile, recipesCount },
  });
});

exports.getUserFollowers = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("followers")
    .populate("followers", "name photo");
  if (!user) return next(new AppError("No user found with that ID", 404));

  const followingIds = new Set(
    (req.user?.following ?? []).map((id) => id.toString()),
  );
  const data = user.followers.map((person) => ({
    ...person.toObject(),
    amFollowing: followingIds.has(person._id.toString()),
  }));
  res.status(200).json({ status: "success", data });
});

exports.getUserFollowing = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select("following")
    .populate("following", "name photo");
  if (!user) return next(new AppError("No user found with that ID", 404));

  const followingIds = new Set(
    (req.user?.following ?? []).map((id) => id.toString()),
  );
  const data = user.following.map((person) => ({
    ...person.toObject(),
    amFollowing: followingIds.has(person._id.toString()),
  }));
  res.status(200).json({ status: "success", data });
});

exports.getUserRecipes = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find({ createdBy: req.params.id }).sort(
    "-createdAt",
  );
  if (!recipes) return next(new AppError("no recipe found!", 404));
  res
    .status(200)
    .json({ status: "success", results: recipes.length, data: recipes });
});

exports.toggleFollow = catchAsync(async (req, res, next) => {
  const targetId = req.params.id;

  if (targetId === req.user.id) {
    return next(new AppError("You cannot follow yourself", 400));
  }

  const target = await User.findById(targetId);
  if (!target) return next(new AppError("No user found with that ID", 404));

  const alreadyFollowing = target.followers.some(
    (f) => f.toString() === req.user.id,
  );
  let updatedTarget;

  if (alreadyFollowing) {
    updatedTarget = await User.findByIdAndUpdate(targetId, {
      $pull: { followers: req.user._id },
      $inc: { followersCount: -1 },
    }, { new: true });
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: target._id },
      $inc: { followingCount: -1 },
    });
  } else {
    updatedTarget = await User.findByIdAndUpdate(targetId, {
      $addToSet: { followers: req.user._id },
      $inc: { followersCount: 1 },
    }, { new: true });
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { following: target._id },
      $inc: { followingCount: 1 },
    });
  }

  res.status(200).json({
    status: "success",
    following: !alreadyFollowing,
    followersCount: updatedTarget.followersCount,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const { sort = "recipes", filter = "all", search, page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  const me = await User.findById(req.user.id).select("following followers");

  let query = { _id: { $ne: new mongoose.Types.ObjectId(req.user.id) } };

  if (filter === "following") {
    query._id = { $in: me.following };
  } else if (filter === "followers") {
    query._id = { $in: me.followers };
  }

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  // recipesCount is a denormalized field and can be stale for recipes created
  // before its save hook existed (or imported outside Mongoose). Count the
  // actual recipes for each user so the cards and recipe sort stay accurate.
  const [users, totalResults] = await Promise.all([
    User.aggregate([
      { $match: query },
      {
        $lookup: {
          from: Recipe.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$createdBy", "$$userId"] } } },
            { $count: "count" },
          ],
          as: "recipeStats",
        },
      },
      {
        $addFields: {
          recipesCount: {
            $ifNull: [{ $arrayElemAt: ["$recipeStats.count", 0] }, 0],
          },
        },
      },
      {
        $sort:
          sort === "followers"
            ? { followersCount: -1, _id: 1 }
            : sort === "following"
              ? { followingCount: -1, _id: 1 }
              : { recipesCount: -1, _id: 1 },
      },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          name: 1,
          photo: 1,
          recipesCount: 1,
          followersCount: 1,
          followingCount: 1,
        },
      },
    ]),
    User.countDocuments(query),
  ]);

  const followingSet = new Set(me.following.map((id) => id.toString()));
  const followersSet = new Set(me.followers.map((id) => id.toString()));

  const data = users.map((u) => ({
    _id: u._id,
    name: u.name,
    photo: u.photo,
    recipesCount: u.recipesCount,
    followersCount: u.followersCount,
    followingCount: u.followingCount,
    amFollowing: followingSet.has(u._id.toString()),
    followsMe: followersSet.has(u._id.toString()),
  }));

  res.status(200).json({
    status: "success",
    results: data.length,
    totalResults,
    data,
  });
});

const FEATURED_USER_IDS = [
  "6a95742527a48445e2997011",
  "6ab0f1b16f39639aa930cd48",
  "6ab23ea3c08d5b770af8e366",
  "6ab21f64585097dbc9fd8d09",
  "6ab21d2b585097dbc9fd8cff",
];

exports.getFeaturedUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ _id: { $in: FEATURED_USER_IDS } }).select(
    "name photo bio",
  );

  // $in doesn't preserve order, so re-sort to match the order you listed
  // them in above. .filter(Boolean) also quietly drops any id that's a typo
  // or points at a deleted user, instead of crashing.
  const ordered = FEATURED_USER_IDS.map((id) =>
    users.find((u) => u._id.toString() === id),
  ).filter(Boolean);

  res.status(200).json({
    status: "success",
    data: ordered,
  });
});

// fetch("http://localhost:3000/api/v1/users/login", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     email: "mido@example.com",
//     password: "password1234",
//   }),
// })
//   .then((res) => res.json())
//   .then((data) => {
//     console.log(data);
//     localStorage.setItem(
//       "token",
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjBmMWIxNmYzOTYzOWFhOTMwY2Q0OCIsImlhdCI6MTc4OTk4MTEwNiwiZXhwIjoxNzkyNTczMTA2fQ.8RPK6AFutqK7IzHKbZnKawMcXgdd14650b_OmPQEaRI",
//     );
//     localStorage.setItem("user", JSON.stringify(data.data.user));
//   });
