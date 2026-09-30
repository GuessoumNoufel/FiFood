const dotenv = require("dotenv");
const mongoose = require("mongoose");
// require("./jobs/weeklyNewsletter");

dotenv.config();
require("./jobs/weeklyNewsletter");
const app = require("./app");
const GoogleLoginCode = require("./models/GoogleLoginCode");
const Like = require("./models/likesModel");
const port = process.env.PORT || 8000;

if (!process.env.DATA_BASE) {
  throw new Error("DATA_BASE must be configured before starting FiFood");
}
if (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET) < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 bytes");
}

mongoose
  .connect(process.env.DATA_BASE)
  .then(async () => {
    await GoogleLoginCode.createIndexes();
    await Like.createIndexes();
    console.log("DB connection successful!");
    app.listen(port, () => console.log(`listening on port ${port}`));
  })
  .catch((error) => {
    console.error("FiFood startup failed:", error.message);
    process.exit(1);
  });
