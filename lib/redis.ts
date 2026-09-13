import { env } from '@/config/env';

/**
 * Lightweight REST-based Redis client for Upstash Redis with In-Memory fallback.
 * Operates without external heavy SDK dependencies.
 */

const memoryCache = new Map<string, { value: any; expiresAt: number }>();

export async function redisGet<T>(key: string): Promise<T | null> {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 0 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.result !== null && json.result !== undefined) {
          try {
            return typeof json.result === 'string' ? JSON.parse(json.result) : json.result;
          } catch {
            return json.result as T;
          }
        }
      }
    } catch (e) {
      console.warn('[Redis] Upstash GET failed, using in-memory cache:', e);
    }
  }

  // Fallback to in-memory cache
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.value as T;
}

export async function redisSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  // Always write to in-memory fallback
  memoryCache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });

  if (url && token) {
    try {
      const valStr = typeof value === 'string' ? value : JSON.stringify(value);
      await fetch(`${url}/set/${encodeURIComponent(key)}/${encodeURIComponent(valStr)}/EX/${ttlSeconds}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      console.warn('[Redis] Upstash SET failed:', e);
    }
  }
}
