// back-end/jobs/weeklyNewsletter.js
const cron = require("node-cron");
const { sendWeeklyRecipe } = require("../utils/newsletterService");

// Every Monday at 09:00 (server time)
// For testing, temporarily use "* * * * *" to run it every minute.
cron.schedule("0 9 * * 1", () => {
  sendWeeklyRecipe().catch((err) =>
    console.error("Weekly newsletter failed:", err.message),
  );
});
