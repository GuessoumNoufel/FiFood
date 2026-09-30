const express = require("express");
const likeController = require("../controllers/likeController");
const authController = require("../controllers/authController");
const rateLimit = require("../utils/rateLimit");

const router = express.Router();

router.use(authController.protect);
router.use(rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: "Too many favorite actions. Try again shortly.",
}));

router.get("/favorites", likeController.getFavorites);
router.post("/likes/:id", likeController.toggleLike);

module.exports = router;
