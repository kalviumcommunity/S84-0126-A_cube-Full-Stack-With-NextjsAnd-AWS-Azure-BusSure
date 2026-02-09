import Redis from 'ioredis';

let redisClient: Redis | null = null;

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn('REDIS_URL is not set. Redis caching is disabled.');
}

export function getRedisClient() {
  if (!redisUrl) return null;
  if (!redisClient) {
    try {
      redisClient = new Redis(redisUrl);
    } catch (error) {
      console.error('Failed to initialize Redis client, disabling cache:', error);
      redisClient = null;
      return null;
    }
  }
  return redisClient;
}

export async function getCachedJson<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  try {
    const cached = await client.get(key);
    if (!cached) return null;

    try {
      return JSON.parse(cached) as T;
    } catch {
      return null;
    }
  } catch (error) {
    console.warn('Redis get failed, skipping cache read:', error);
    return null;
  }
}

export async function setCachedJson(key: string, value: unknown, ttlSeconds: number) {
  const client = getRedisClient();
  if (!client) return;

  try {
    const payload = JSON.stringify(value);
    if (ttlSeconds > 0) {
      await client.set(key, payload, 'EX', ttlSeconds);
    } else {
      await client.set(key, payload);
    }
  } catch (error) {
    console.warn('Redis set failed, skipping cache write:', error);
  }
}

export async function deleteCacheKey(key: string) {
  const client = getRedisClient();
  if (!client) return;
  try {
    await client.del(key);
  } catch (error) {
    console.warn('Redis del failed, skipping cache delete:', error);
  }
}

export async function deleteKeysByPattern(pattern: string) {
  const client = getRedisClient();
  if (!client) return;

  try {
    let cursor = '0';
    do {
      const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await client.del(...keys);
      }
    } while (cursor !== '0');
  } catch (error) {
    console.warn('Redis scan/del failed, skipping pattern delete:', error);
  }
}
