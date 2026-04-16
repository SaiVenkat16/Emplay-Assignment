const Redis = require('ioredis');
require('dotenv').config();

// Production (Upstash): REDIS_URL=rediss://default:pass@host.upstash.io:6379
// Development (local/docker): REDIS_HOST + REDIS_PORT
let redis;

if (process.env.REDIS_URL) {
  // URL నుండి explicit గా parse చేసి connect చేస్తాం
  // ioredis full URL తో "AUTH default PASSWORD" పంపిస్తుంది
  // Upstash only password expect చేస్తుంది — explicit config fix చేస్తుంది
  const url = new URL(process.env.REDIS_URL);
  redis = new Redis({
    host: url.hostname,
    port: parseInt(url.port) || 6379,
    password: url.password,
    tls: {},
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
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
