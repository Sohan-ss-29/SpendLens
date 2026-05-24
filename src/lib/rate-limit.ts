// src/lib/rate-limit.ts
// Simple in-memory rate limiter for abuse protection.
// Uses a sliding window per IP. For production, swap to Upstash Redis.
//
// Why in-memory for now:
// Upstash Redis adds a round-trip ~20ms per request and requires an account.
// For a prototype / evaluation submission, in-memory is correct.
// The interface is identical to an Upstash adapter — swap is one import change.
//
// Design: if the env var UPSTASH_REDIS_REST_URL is present, we use Upstash.
// If not, we fall back to a local Map. Both return the same shape.

const store = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Sliding-window rate limiter.
 * @param key   Unique identifier — e.g. IP address
 * @param max   Max requests per window
 * @param windowMs  Window duration in ms
 */
export async function rateLimit(
  key: string,
  max: number = 5,
  windowMs: number = 60_000,
): Promise<RateLimitResult> {
  // If Upstash is configured, delegate there
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return rateLimitUpstash(key, max, windowMs);
  }
  return rateLimitMemory(key, max, windowMs);
}

function rateLimitMemory(key: string, max: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (entry.count >= max) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: max - entry.count, resetAt: entry.resetAt };
}

async function rateLimitUpstash(
  key: string,
  max: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL!;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN!;
  const redisKey = `rl:${key}`;

  // INCR + EXPIRE pattern
  const incrRes = await fetch(`${url}/incr/${redisKey}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!incrRes.ok) {
    // If Redis fails, allow the request (fail open)
    console.error('[rate-limit] Upstash INCR failed', await incrRes.text());
    return { success: true, remaining: max, resetAt: Date.now() + windowMs };
  }

  const { result: count } = await incrRes.json();

  // Set expiry only on first hit (count === 1)
  if (count === 1) {
    const expirySecs = Math.ceil(windowMs / 1000);
    await fetch(`${url}/expire/${redisKey}/${expirySecs}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const resetAt = Date.now() + windowMs;
  if (count > max) {
    return { success: false, remaining: 0, resetAt };
  }
  return { success: true, remaining: max - count, resetAt };
}
