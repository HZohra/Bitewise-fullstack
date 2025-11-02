//server-side recipe search route, lets chatbot or frontend safely talk to Edamam's Recipe API without exposing the private API keys.

import express from 'express';
import { fetchRecipes } from '../config/edamam.js';

const router = express.Router();

// Example: GET /recipes?q=pasta&filters=vegan,gluten-free
router.get('/', async (req, res) => {
  try {
    const { q, filters } = req.query;
    const dietFilters = filters ? filters.split(',') : [];
    const data = await fetchRecipes(q, dietFilters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

export default router;
