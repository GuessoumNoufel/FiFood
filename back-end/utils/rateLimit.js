const windows = new Map();
let lastCleanup = Date.now();

module.exports = function rateLimit({ windowMs, max, message }) {
  return (req, res, next) => {
    const now = Date.now();
    if (now - lastCleanup > windowMs) {
      for (const [key, entry] of windows) {
        if (entry.resetAt <= now) windows.delete(key);
      }
      lastCleanup = now;
    }

    const key = `${req.baseUrl}${req.path}:${req.ip}`;
    let entry = windows.get(key);
    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      windows.set(key, entry);
    }

    entry.count += 1;
    res.setHeader("RateLimit-Limit", max);
    res.setHeader("RateLimit-Remaining", Math.max(0, max - entry.count));
    res.setHeader("RateLimit-Reset", Math.ceil(entry.resetAt / 1000));
    if (entry.count > max) {
      return res.status(429).json({ status: "fail", message });
    }
    next();
  };
};
