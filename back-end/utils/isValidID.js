const mongoose = require("mongoose");

const isLocalRecipeId = (id) => {
  return mongoose.Types.ObjectId.isValid(id) && id.length === 24;
};

module.exports = isLocalRecipeId;
