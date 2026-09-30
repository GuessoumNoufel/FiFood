const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

exports.createRecipeNotifications = async (recipe) => {
  try {
    const author = await User.findById(recipe.createdBy).select("followers");
    if (!author?.followers?.length) return;

    await Notification.insertMany(
      author.followers.map((recipient) => ({
        recipient,
        actor: recipe.createdBy,
        recipe: recipe._id,
      })),
    );
  } catch (error) {
    // Notification persistence must not turn a successful recipe creation into an API failure.
    console.error("Could not create recipe notifications:", error.message);
  }
};
