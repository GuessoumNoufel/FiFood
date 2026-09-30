const mongoose = require("mongoose");

const googleLoginCodeSchema = new mongoose.Schema({
  codeHash: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

module.exports = mongoose.model("GoogleLoginCode", googleLoginCodeSchema);
