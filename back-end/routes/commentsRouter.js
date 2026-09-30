const express = require("express");
const authController = require("./../controllers/authController");
const commentController = require("./../controllers/commentController");
const rateLimit = require("../utils/rateLimit");

const router = express.Router();

router.get("/recipe/:recipeId", commentController.getCommentsForRecipe);

router.use(authController.protect);
router.use(rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: "Too many comment actions. Try again shortly.",
}));

router.post("/:recipeId", commentController.createComment);
router.patch("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);
router.post("/:id/like", commentController.toggleCommentLike);

module.exports = router;
