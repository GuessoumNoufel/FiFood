const test = require("node:test");
const assert = require("node:assert/strict");

process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "test-client-id";
process.env.GOOGLE_CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "test-client-secret";

const passportConfig = require("../utils/passportConfig");

test("buildGoogleCallbackUrl prefers explicit GOOGLE_CALLBACK_URL", () => {
  const previous = {
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    API_URL: process.env.API_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL,
  };

  process.env.GOOGLE_CALLBACK_URL =
    "https://example.com/api/v1/users/auth/google/callback";
  delete process.env.API_URL;
  delete process.env.VERCEL_URL;
  delete process.env.RENDER_EXTERNAL_URL;

  try {
    assert.equal(
      passportConfig.buildGoogleCallbackUrl(),
      "https://example.com/api/v1/users/auth/google/callback",
    );
  } finally {
    Object.entries(previous).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  }
});

test("buildGoogleCallbackUrl falls back to API_URL when explicit callback is missing", () => {
  const previous = {
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    API_URL: process.env.API_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL,
  };

  delete process.env.GOOGLE_CALLBACK_URL;
  process.env.API_URL = "https://api.example.com/api/v1";
  delete process.env.VERCEL_URL;
  delete process.env.RENDER_EXTERNAL_URL;

  try {
    assert.equal(
      passportConfig.buildGoogleCallbackUrl(),
      "https://api.example.com/api/v1/users/auth/google/callback",
    );
  } finally {
    Object.entries(previous).forEach(([key, value]) => {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    });
  }
});
