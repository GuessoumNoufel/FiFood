// back-end/routes/newsletterRoutes.js
const express = require("express");
const newsletterController = require("../controllers/newsletterController");

const router = express.Router();

// all public: guests subscribe from the footer, and email links carry no login
router.post("/subscribe", newsletterController.subscribe);
router.get("/confirm/:token", newsletterController.confirm);
router.get("/unsubscribe/:token", newsletterController.unsubscribe);

module.exports = router;
