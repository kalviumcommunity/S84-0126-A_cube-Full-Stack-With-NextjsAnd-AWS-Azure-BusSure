import Redis from 'ioredis';

let redisClient: Redis | null = null;

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn('REDIS_URL is not set. Redis caching is disabled.');
}

export function getRedisClient() {
  if (!redisUrl) return null;
  if (!redisClient) {
    redisClient = new Redis(redisUrl);
  }
  return redisClient;
}

export async function getCachedJson<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client) return null;

  const cached = await client.get(key);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as T;
  } catch {
    return null;
  }
}

export async function setCachedJson(key: string, value: unknown, ttlSeconds: number) {
  const client = getRedisClient();
  if (!client) return;

  const payload = JSON.stringify(value);
  if (ttlSeconds > 0) {
    await client.set(key, payload, 'EX', ttlSeconds);
  } else {
    await client.set(key, payload);
  }
}

export async function deleteCacheKey(key: string) {
  const client = getRedisClient();
  if (!client) return;
  await client.del(key);
}

export async function deleteKeysByPattern(pattern: string) {
  const client = getRedisClient();
  if (!client) return;

  let cursor = '0';
  do {
    const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = nextCursor;
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } while (cursor !== '0');
}
