const express = require("express");
const authController = require("./../controllers/authController");
const commentController = require("./../controllers/commentController");

const router = express.Router();

router.get("/recipe/:recipeId", commentController.getCommentsForRecipe);

router.use(authController.protect);

router.post("/:recipeId", commentController.createComment);
router.patch("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);
router.post("/:id/like", commentController.toggleCommentLike);

module.exports = router;
