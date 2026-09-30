// back-end/models/Subscriber.js
const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  // stays false until the person clicks the link in the confirmation email
  confirmed: { type: Boolean, default: false },
  // one secret token, used for both the confirm link and the unsubscribe link
  token: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(24).toString("hex"),
  },
  subscribedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
