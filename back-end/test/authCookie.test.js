const test = require('node:test');
const assert = require('node:assert/strict');

const previous = {
  NODE_ENV: process.env.NODE_ENV,
  COOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE,
  CLIENT_URL: process.env.CLIENT_URL,
};

const authCookiePath = require.resolve('../utils/authCookie');
const loadAuthCookie = () => {
  delete require.cache[authCookiePath];
  return require(authCookiePath);
};

test('production auth cookies use cross-site settings', () => {
  process.env.NODE_ENV = 'production';
  delete process.env.COOKIE_SAME_SITE;
  process.env.CLIENT_URL = 'https://FiFood.vercel.app';

  const { setAuthCookie } = loadAuthCookie();
  const cookies = {};
  const res = {
    cookie(name, value, options) {
      cookies[name] = { value, options };
    },
  };

  setAuthCookie(res, 'demo-token');
  assert.equal(cookies.fifood_session.options.sameSite, 'none');
  assert.equal(cookies.fifood_session.options.secure, true);
});

test('oauth state cookie is also secure for production', () => {
  process.env.NODE_ENV = 'production';
  delete process.env.COOKIE_SAME_SITE;
  process.env.CLIENT_URL = 'https://FiFood.vercel.app';

  const { setOAuthStateCookie } = loadAuthCookie();
  const cookies = {};
  const res = {
    cookie(name, value, options) {
      cookies[name] = { value, options };
    },
  };

  setOAuthStateCookie(res, 'demo-state');
  assert.equal(cookies.fifood_oauth_state.options.sameSite, 'none');
  assert.equal(cookies.fifood_oauth_state.options.secure, true);
});

for (const [key, value] of Object.entries(previous)) {
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}
