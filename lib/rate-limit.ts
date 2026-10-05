// Lightweight in-memory, fixed-window rate limiter (from synq-logic-website).
// State lives in each server instance's memory: on serverless hosts this is a best-effort guard,
// not a hard cap.

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();
const CLEANUP_THRESHOLD = 5000;

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  if (store.size > CLEANUP_THRESHOLD) {
    for (const [k, v] of store) if (v.resetAt <= now) store.delete(k);
  }

  let entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs };
    store.set(key, entry);
  }

  entry.count += 1;
  return {
    allowed: entry.count <= limit,
    remaining: Math.max(0, limit - entry.count),
    retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
  };
}
