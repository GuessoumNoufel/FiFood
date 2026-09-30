// back-end/routes/newsletterRoutes.js
const express = require("express");
const newsletterController = require("../controllers/newsletterController");
const rateLimit = require("../utils/rateLimit");

const router = express.Router();

// all public: guests subscribe from the footer, and email links carry no login
router.post(
  "/subscribe",
  rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: "Too many subscription requests. Try again later." }),
  newsletterController.subscribe,
);
router.get("/confirm/:token", newsletterController.confirm);
router.get("/unsubscribe/:token", newsletterController.unsubscribe);

module.exports = router;
