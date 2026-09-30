require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const Like = require("../models/likesModel");
const Comment = require("../models/commentsModel");

async function reconcileData() {
  if (!process.env.DATA_BASE) throw new Error("DATA_BASE is required");
  await mongoose.connect(process.env.DATA_BASE);

  // Remove duplicate favorites before creating the unique compound indexes.
  const duplicateGroups = Like.aggregate([
    {
      $group: {
        _id: {
          user: "$user",
          isLocalRecipe: "$isLocalRecipe",
          recipe: {
            $cond: ["$isLocalRecipe", "$localRecipeId", "$mealDBId"],
          },
        },
        ids: { $push: "$_id" },
      },
    },
    { $match: { "ids.1": { $exists: true } } },
  ]).cursor({ batchSize: 200 });

  for await (const group of duplicateGroups) {
    await Like.deleteMany({ _id: { $in: group.ids.slice(1) } });
  }

  await Like.createIndexes();
  const users = await User.find().select("_id following").lean();
  const validUserIds = new Set(users.map((user) => user._id.toString()));
  const followersByUser = new Map(users.map((user) => [user._id.toString(), []]));
  for (const user of users) {
    for (const followedId of user.following ?? []) {
      const followedKey = followedId.toString();
      if (validUserIds.has(followedKey)) followersByUser.get(followedKey).push(user._id);
    }
  }
  if (users.length) {
    await User.bulkWrite(
      users.map((user) => {
        const following = (user.following ?? []).filter((id) => validUserIds.has(id.toString()));
        const followers = followersByUser.get(user._id.toString());
        return {
          updateOne: {
            filter: { _id: user._id },
            update: {
              $set: {
                following,
                followers,
                followingCount: following.length,
                followersCount: followers.length,
                recipesCount: 0,
              },
            },
          },
        };
      }),
    );
  }

  const recipeCounts = await Recipe.aggregate([
    { $group: { _id: "$createdBy", count: { $sum: 1 } } },
  ]);
  if (recipeCounts.length) {
    await User.bulkWrite(
      recipeCounts.map(({ _id, count }) => ({
        updateOne: { filter: { _id }, update: { $set: { recipesCount: count } } },
      })),
    );
  }

  await Recipe.updateMany({}, { $set: { likes: [], likesCount: 0 } });
  const recipeLikes = await Like.aggregate([
    { $match: { isLocalRecipe: true, localRecipeId: { $ne: null } } },
    {
      $group: {
        _id: "$localRecipeId",
        users: { $addToSet: "$user" },
      },
    },
  ]);
  if (recipeLikes.length) {
    await Recipe.bulkWrite(
      recipeLikes.map(({ _id, users }) => ({
        updateOne: {
          filter: { _id },
          update: { $set: { likes: users, likesCount: users.length } },
        },
      })),
    );
  }

  await Comment.updateMany({}, [
    { $set: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
  ]);
  console.log("FiFood counters and favorite uniqueness have been reconciled.");
}

reconcileData()
  .catch((error) => {
    console.error("FiFood data reconciliation failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
