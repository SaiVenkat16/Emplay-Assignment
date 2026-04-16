const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB } = require('./db/postgres');
const promptRoutes = require('./routes/prompts');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
