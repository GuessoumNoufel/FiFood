export function isCacheFresh(entry, ttl) {
  return Boolean(entry && Date.now() - entry.cachedAt < ttl);
}
