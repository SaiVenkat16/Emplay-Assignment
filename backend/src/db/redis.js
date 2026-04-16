const Redis = require('ioredis');
require('dotenv').config();

// Redis connection create chestundi
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  // Docker use chestunnappudu host 'redis' avutundi
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection failed:', err.message);
});

module.exports = redis;
