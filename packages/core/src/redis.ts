import { createClient } from 'redis';
import { loadConfig } from './config.js';

const config = loadConfig();

let redisClient: ReturnType<typeof createClient> | null = null;

export const getRedisClient = async () => {
  if (!redisClient) {
    redisClient = createClient({
      url: config.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      console.error('[Redis] Client Error:', err);
    });

    await redisClient.connect();
    console.log('[Redis] Shared client connected');
  }
  return redisClient;
};

/**
 * Utility to execute a redis command with automatic connection handling
 */
export const execRedis = async <T>(
  fn: (client: ReturnType<typeof createClient>) => Promise<T>
): Promise<T | null> => {
  try {
    const client = await getRedisClient();
    return await fn(client);
  } catch (err) {
    console.error('[Redis] Execution error, falling back:', err);
    return null;
  }
};

export const getCache = async (key: string): Promise<string | null> => {
  return await execRedis((client) => client.get(key));
};

export const setCache = async (key: string, value: string, ttlSeconds = 3600): Promise<void> => {
  await execRedis((client) => client.setEx(key, ttlSeconds, value));
};

export const deleteCache = async (key: string): Promise<void> => {
  await execRedis((client) => client.del(key));
};

export const deleteByPrefix = async (prefix: string): Promise<void> => {
  await execRedis(async (client) => {
    let cursor = '0';
    do {
      const reply = await client.scan(cursor, {
        MATCH: `${prefix}*`,
        COUNT: 100,
      });
      cursor = reply.cursor;
      if (reply.keys.length > 0) {
        await client.del(reply.keys);
      }
    } while (cursor !== '0');
  });
};
