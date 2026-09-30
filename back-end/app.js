const express = require("express");
const globleErrorHandler = require("./controllers/errorController");
const fetchMealById = require("./utils/mealDB_API").fetchMealById;
const searchMealsByName = require("./utils/mealDB_API").searchMealsByName;
const passport = require("./utils/passportConfig");
const newsletterRouter = require("./routes/newsletterRoutes");

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use(passport.initialize());

const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRouts");
const mealAPI_Routes = require("./routes/mealAPI_Routes");
const likesRoutes = require("./routes/likeRouter");
const commentsRoutes = require("./routes/commentsRouter");

app.get("/", (req, res) => {
  res.status(200).json({ message: "api is running" });
});

// fetchMealById("52771");
// searchMealsByName("pizza");
app.get("/api/v1/test", (req, res) => res.send("working"));
// 1/ routers
// app.use("/api/v1/newsletter", require("./routes/newsletterRoutes"));
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/recipes", recipeRoutes);
app.use("/api/v1/mealAPI", mealAPI_Routes);
app.use("/api/v1/likedRecipes", likesRoutes);
app.use("/api/v1/comments", commentsRoutes);
app.use("/api/v1/newsletter", newsletterRouter);

app.use(globleErrorHandler);

module.exports = app;
