import axios from 'axios';

// Base URL — vite proxy వల్ల /prompts directly work అవుతుంది
const API_BASE = '/prompts';

// ─── GET /prompts — అన్ని prompts తీసుకొస్తుంది ──────────────
export const getAllPrompts = async () => {
  const response = await axios.get(API_BASE);
  return response.data;
};

// ─── GET /prompts/:id — Single prompt + view count ───────────
export const getPromptById = async (id) => {
  const response = await axios.get(`${API_BASE}/${id}`);
  return response.data;
};

// ─── POST /prompts — New prompt create చేస్తుంది ─────────────
export const createPrompt = async (promptData) => {
  const response = await axios.post(API_BASE, promptData);
  return response.data;
};
