const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./db/postgres');
const promptRoutes = require('./routes/prompts');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
// Dev + Production origins allow చేస్తుంది
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Postman / curl లాంటి tools కి origin undefined అవుతుంది
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────
app.use('/prompts', promptRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: '🚀 Emplay API is running!', status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Start Server ─────────────────────────────────────────────
const startServer = async () => {
  await initDB(); // PostgreSQL table ready
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running at http://localhost:${PORT}`);
  });
};

startServer();
