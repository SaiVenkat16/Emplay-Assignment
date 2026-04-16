require('dotenv').config();

// Production (Upstash): @upstash/redis REST client
// Development (local): ioredis TCP client
let redis;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const { Redis } = require('@upstash/redis');
    redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log('Redis (Upstash REST) connected successfully');
} else {
    const IORedis = require('ioredis');
    redis = new IORedis({
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT) || 6379,
    });
    redis.on('connect', () => console.log('Redis (local) connected successfully'));
    redis.on('error', (err) => console.error('Redis connection failed:', err.message));
}

module.exports = redis;
