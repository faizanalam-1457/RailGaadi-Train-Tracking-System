import { redisGet, redisSet } from '@/lib/redis';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Sliding window rate limiter for API routes.
 * Default limit: 60 requests per 60 seconds.
 */
export async function checkRateLimit(
  identifier: string,
  limit = 60,
  windowSeconds = 60
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const key = `ratelimit:${identifier}:${Math.floor(now / windowSeconds)}`;

  try {
    const current = await redisGet<number>(key);
    const count = (current || 0) + 1;
    await redisSet(key, count, windowSeconds);

    const remaining = Math.max(0, limit - count);
    const resetSeconds = windowSeconds - (now % windowSeconds);

    return {
      success: count <= limit,
      limit,
      remaining,
      resetSeconds,
    };
  } catch {
    // In-memory fallback if Redis operations fail
    const memKey = `${identifier}:${Math.floor(now / windowSeconds)}`;
    const entry = rateLimitMap.get(memKey) || { count: 0, resetAt: now + windowSeconds };
    entry.count += 1;
    rateLimitMap.set(memKey, entry);

    const remaining = Math.max(0, limit - entry.count);
    return {
      success: entry.count <= limit,
      limit,
      remaining,
      resetSeconds: Math.max(1, entry.resetAt - now),
    };
  }
}
