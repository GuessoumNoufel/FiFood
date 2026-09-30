const express = require("express");
const likeController = require("../controllers/likeController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/favorites", likeController.getFavorites);
router.post("/likes/:id", likeController.toggleLike);

module.exports = router;
