// back-end/utils/newsletterService.js
const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const Subscriber = require("../models/Subscriber");
const { sendEmail } = require("./email");
const {
  weeklyEmail,
  newRecipeEmail,
  unsubscribeUrl,
} = require("./emailTemplates");

// One bad address must never stop the rest of the batch.
async function sendToAll(subscribers, buildMessage) {
  for (const sub of subscribers) {
    try {
      const { subject, html } = buildMessage(sub);
      await sendEmail({ to: sub.email, subject, html });
    } catch (err) {
      console.error(`Newsletter email to ${sub.email} failed:`, err.message);
    }
  }
}

// One random recipe, sent to every confirmed subscriber.
exports.sendWeeklyRecipe = async () => {
  const [recipe] = await Recipe.aggregate([{ $sample: { size: 1 } }]);
  if (!recipe) return;

  const author = await User.findById(recipe.createdBy).select("name");
  const subscribers = await Subscriber.find({ confirmed: true });

  await sendToAll(subscribers, (sub) => ({
    subject: `Your recipe of the week: ${recipe.title}`,
    html: weeklyEmail(recipe, author, unsubscribeUrl(sub.token)),
  }));
};

// Emails confirmed subscribers who follow the recipe's author. A follower is
// matched to a subscriber by email, so it only reaches people whose
// subscribed email is the same as their account email.
// Never throws: it runs in the background after the recipe is already saved.
exports.notifyFollowersOfNewRecipe = async (recipe) => {
  try {
    const author = await User.findById(recipe.createdBy).select(
      "name followers",
    );
    if (!author || !author.followers?.length) return;

    const followers = await User.find({
      _id: { $in: author.followers },
    }).select("email");
    const emails = followers.map((f) => f.email.toLowerCase());

    const subscribers = await Subscriber.find({
      confirmed: true,
      email: { $in: emails },
    });

    await sendToAll(subscribers, (sub) => ({
      subject: `${author.name} just shared a new recipe: ${recipe.title}`,
      html: newRecipeEmail(author, recipe, unsubscribeUrl(sub.token)),
    }));
  } catch (err) {
    console.error("Follower notification failed:", err.message);
  }
};
