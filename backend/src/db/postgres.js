const { Pool } = require('pg');
require('dotenv').config();

// Production (Render): DATABASE_URL = full connection string
// Development: separate host/port/user/password vars
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Render SSL require చేస్తుంది
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'emplay_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

// Connection test
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ PostgreSQL connection failed:', err.message);
  } else {
    console.log('✅ PostgreSQL connected successfully');
    release();
  }
});

// Prompts table create chestundi (already lekapothe)
const initDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS prompts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      complexity INTEGER CHECK (complexity >= 1 AND complexity <= 10) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log('✅ Prompts table ready');
  } catch (err) {
    console.error('❌ Table creation failed:', err.message);
  }
};

module.exports = { pool, initDB };
