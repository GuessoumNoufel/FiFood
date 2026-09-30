const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { getNames } = require("country-list");

const countries = getNames();

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  authProvider: { type: String, enum: ["local", "google"], default: "local" },
  password: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
    minlength: [8, "Password should be longer than 8 characters!"],
    maxlength: [40, "Password too long!"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: function () {
      return this.authProvider === "local";
    },
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },

  favoriteRecipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],

  bio: { type: String, maxlength: [250, "Bio must be 250 characters or less"] },

  country: {
    type: String,
    enum: countries,
    trim: true,
  },
  photo: {
    type: String,
    default:
      "https://res.cloudinary.com/clvbhmja/image/upload/v1789888038/default-profile-img.jpg",
  },
  coverImage: {
    type: String,
    default:
      "https://res.cloudinary.com/clvbhmja/image/upload/v1789888039/default-cover-img.png",
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followersCount: { type: Number, default: 0 },
  followingCount: { type: Number, default: 0 },

  passwordChangedAt: Date,
  passwordResetToken: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  recipesCount: { type: Number, default: 0 },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

//methods
userSchema.methods.correctPassword = async function (
  condidatePassword,
  userPassword,
) {
  const cerrctPassword = await bcrypt.compare(condidatePassword, userPassword);
  return cerrctPassword;
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false; // password was never changed since account creation
};

const User = mongoose.model("User", userSchema);
module.exports = User;
