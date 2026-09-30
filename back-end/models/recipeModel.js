const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  // category: String,
  category: { type: String },
  area: String,
  description: { type: String, maxlength: 300 },
  time: Number, // minutes
  servings: Number,
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
  instructions: { type: String, required: true },
  ingredients: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likesCount: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      value: { type: Number, min: 1, max: 5 },
    },
  ],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

recipeSchema.post("save", async function (doc) {
  await mongoose.model("User").findByIdAndUpdate(doc.createdBy, {
    $inc: { recipesCount: 1 },
  });
});

recipeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await mongoose.model("User").findByIdAndUpdate(doc.createdBy, {
      $inc: { recipesCount: -1 },
    });
  }
});

const Recipe = mongoose.model("Recipe", recipeSchema);
module.exports = Recipe;

// const recipeSchema = new mongoose.Schema({
//   mealDBId: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   title: { type: String, required: true },
//   image: { type: String, required: true },
//   category: String,
//   area: String,
//   instructions: String,
//   ingredients: [String],
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   likesCount: { type: Number, default: 0 },
// });
