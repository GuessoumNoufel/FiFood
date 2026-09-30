const mongoose = require("mongoose");
const Recipe = require("./recipeModel");

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isLocalRecipe: { type: Boolean, required: true },
  localRecipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }, // set only when isLocalRecipe is true
  mealDBId: String, // set only when isLocalRecipe is false
  title: String,
  image: String,
  category: String,
  area: String,
  instructions: String,
  ingredients: [String],
  createdAt: { type: Date, default: Date.now },
}, { autoIndex: false });

likeSchema.index(
  { user: 1, localRecipeId: 1 },
  { unique: true, partialFilterExpression: { isLocalRecipe: true } },
);
likeSchema.index(
  { user: 1, mealDBId: 1 },
  { unique: true, partialFilterExpression: { isLocalRecipe: false } },
);

// recipeSnapshot: {
//   mealDBId: String, // present only if it came from TheMealDB; absent for local recipes
//   localRecipeId: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }, // present only if it's a local user-created recipe
// },

likeSchema.post("save", async function (doc) {
  if (doc.isLocalRecipe) {
    await Recipe.findByIdAndUpdate(doc.localRecipeId, {
      $inc: { likesCount: 1 },
      $addToSet: { likes: doc.user },
    });
  }
});

likeSchema.post("findOneAndDelete", async function (doc) {
  if (doc && doc.isLocalRecipe) {
    await Recipe.findByIdAndUpdate(doc.localRecipeId, {
      $inc: { likesCount: -1 },
      $pull: { likes: doc.user },
    });
  }
});

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
