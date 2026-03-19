import Redis from 'ioredis';

export let redisClient;

export async function connectRedis() {
  try {
    redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    redisClient.on('connect', () => console.log('✅ Redis connected'));
    redisClient.on('error', (err) => console.error('❌ Redis error:', err));
  } catch (err) {
    console.error('❌ Redis connection failed:', err.message);
  }
}
