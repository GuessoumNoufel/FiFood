const dotenv = require("dotenv");
const mongoose = require("mongoose");
// require("./jobs/weeklyNewsletter");

dotenv.config();
console.log("EMAIL_HOST at startup:", process.env.EMAIL_HOST);
require("./jobs/weeklyNewsletter");
const app = require("./app");
const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.DATA_BASE)
  .then(() => console.log("DB connection successful!"));

app.listen(port, () => {
  console.log(`listen on port ${port}`);
});
