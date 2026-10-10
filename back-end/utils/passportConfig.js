const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");

const buildGoogleCallbackUrl = () => {
  if (process.env.GOOGLE_CALLBACK_URL) {
    return process.env.GOOGLE_CALLBACK_URL.replace(/\/$/, "");
  }

  const candidateUrls = [
    process.env.API_URL,
    process.env.RENDER_EXTERNAL_URL
      ? `https://${process.env.RENDER_EXTERNAL_URL}`
      : "",
    process.env.APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    "http://localhost:8000/api/v1",
  ].filter(Boolean);

  const apiUrl = candidateUrls[0] || "http://localhost:8000/api/v1";
  const normalizedBase = apiUrl.replace(/\/$/, "").replace(/\/api\/v1$/, "");

  return `${normalizedBase}/api/v1/users/auth/google/callback`;
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: buildGoogleCallbackUrl(),
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.trim().toLowerCase();
        if (!email) return done(new Error("Google did not provide an email"));
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            photo: profile.photos[0]?.value,
            authProvider: "google",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
module.exports.buildGoogleCallbackUrl = buildGoogleCallbackUrl;
