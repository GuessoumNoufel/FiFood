const catchAsync = require("../utils/catchAsync");
const Comment = require("../models/commentsModel");
const AppError = require("../utils/appError");
const { isLocalRecipeId } = require("../utils/isLocalId");
const Recipe = require("../models/recipeModel");

exports.createComment = catchAsync(async function (req, res, next) {
  const newComment = await Comment.create({
    text: req.body.text,
    user: req.user._id,
    recipeId: req.params.recipeId,
  });

  if (isLocalRecipeId(req.params.recipeId)) {
    await Recipe.findByIdAndUpdate(req.params.recipeId, {
      $push: { comments: newComment._id },
    });
  }
  res.status(201).json({
    status: "success",
    data: newComment,
  });
});

exports.getCommentsForRecipe = catchAsync(async function (req, res, next) {
  const comments = await Comment.find({ recipeId: req.params.recipeId })
    .sort("-createdAt")
    .populate("user", "name photo");

  res.status(200).json({
    status: "success",
    results: comments.length,
    data: comments,
  });
});

exports.updateComment = catchAsync(async function (req, res, next) {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError("No comment found with that ID", 404));
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You are not allowed to edit this comment", 403));
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true, runValidators: true },
  );

  res.status(200).json({
    status: "success",
    data: updatedComment,
  });
});
exports.deleteComment = catchAsync(async function (req, res, next) {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError("No comment found with that ID", 404));
  }

  if (comment.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not allowed to delete this comment", 403),
    );
  }

  await Comment.findByIdAndDelete(req.params.id);

  if (isLocalRecipeId(comment.recipeId)) {
    await Recipe.findByIdAndUpdate(comment.recipeId, {
      $pull: { comments: comment._id },
    });
  }

  res.status(200).json({
    status: "success",
    data: null,
  });
});
exports.toggleCommentLike = catchAsync(async function (req, res, next) {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new AppError("No comment found with that ID", 404));
  }

  const alreadyLiked = comment.likes.some(
    (userId) => userId.toString() === req.user._id.toString(),
  );

  let updatedComment;
  if (alreadyLiked) {
    updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id }, $inc: { likesCount: -1 } },
      { new: true },
    );
  } else {
    updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id }, $inc: { likesCount: 1 } },
      { new: true },
    );
  }

  res.status(200).json({
    status: "success",
    data: updatedComment,
  });
});
