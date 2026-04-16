const Redis = require('ioredis');
require('dotenv').config();

// Production (Upstash): REDIS_URL=rediss://default:pass@host.upstash.io:6380
// Development (local/docker): REDIS_HOST + REDIS_PORT
let redis;

if (process.env.REDIS_URL) {
  // Upstash SSL connection
  redis = new Redis(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false },
  });
} else {
  // Local / Docker connection
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
  });
}

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection failed:', err.message);
});

module.exports = redis;
