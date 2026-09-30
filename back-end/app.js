const express = require("express");
const globleErrorHandler = require("./controllers/errorController");
const fetchMealById = require("./utils/mealDB_API").fetchMealById;
const searchMealsByName = require("./utils/mealDB_API").searchMealsByName;
const passport = require("./utils/passportConfig");
const newsletterRouter = require("./routes/newsletterRoutes");

const app = express();
if (process.env.TRUST_PROXY) {
  const proxySetting = process.env.TRUST_PROXY;
  app.set(
    "trust proxy",
    proxySetting === "true"
      ? 1
      : Number.isFinite(Number(proxySetting))
        ? Number(proxySetting)
        : proxySetting,
  );
}
app.use(express.json({ limit: "100kb" }));
const cors = require("cors");
const allowedOrigins = new Set([
  ...(process.env.NODE_ENV === "production" ? [] : ["http://localhost:5173"]),
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL.replace(/\/$/, "")] : []),
  ...(process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
]);
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin));
  },
  credentials: true,
}));
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
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
