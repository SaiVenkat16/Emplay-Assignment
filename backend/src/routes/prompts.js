const express = require('express');
const router = express.Router();
const {
  getAllPrompts,
  createPrompt,
  getPromptById,
} = require('../controllers/promptController');

// GET /prompts      — List all prompts
router.get('/', getAllPrompts);

// POST /prompts     — Create new prompt
router.post('/', createPrompt);

// GET /prompts/:id  — Get single prompt + increment Redis view count
router.get('/:id', getPromptById);

module.exports = router;
