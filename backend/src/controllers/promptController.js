const { pool } = require('../db/postgres');
const redis = require('../db/redis');

// ============================================================
// GET /prompts — అన్ని prompts తీసుకొస్తుంది
// ============================================================
const getAllPrompts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, complexity, created_at FROM prompts ORDER BY created_at DESC'
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error('getAllPrompts error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================================
// POST /prompts — New prompt create చేస్తుంది
// ============================================================
const createPrompt = async (req, res) => {
  const { title, content, complexity } = req.body;

  // Backend Validation
  const errors = {};

  if (!title || title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  if (!content || content.trim().length < 20) {
    errors.content = 'Content must be at least 20 characters';
  }
  if (!complexity || isNaN(complexity) || complexity < 1 || complexity > 10) {
    errors.complexity = 'Complexity must be between 1 and 10';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const result = await pool.query(
      'INSERT INTO prompts (title, content, complexity) VALUES ($1, $2, $3) RETURNING *',
      [title.trim(), content.trim(), parseInt(complexity)]
    );

    return res.status(201).json({
      success: true,
      message: 'Prompt created successfully',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('createPrompt error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ============================================================
// GET /prompts/:id — Single prompt + Redis view count
// ============================================================
const getPromptById = async (req, res) => {
  const { id } = req.params;

  // ID valid number అయినా కాదా check
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: 'Invalid prompt ID' });
  }

  try {
    // PostgreSQL నుండి prompt తీసుకొస్తుంది
    const result = await pool.query('SELECT * FROM prompts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Prompt not found' });
    }

    const prompt = result.rows[0];

    // ⚡ Redis INCR — ప్రతిసారి view count +1 చేస్తుంది
    const redisKey = `prompt:${id}:views`;
    const viewCount = await redis.incr(redisKey);

    return res.status(200).json({
      success: true,
      data: {
        ...prompt,
        view_count: viewCount, // Redis నుండి live count
      },
    });
  } catch (err) {
    console.error('getPromptById error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getAllPrompts, createPrompt, getPromptById };
