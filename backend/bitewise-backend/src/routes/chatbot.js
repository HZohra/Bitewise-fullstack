import express from 'express';
import { processChatMessage } from '../chatbot/chatbot/index.js';

const router = express.Router();

// POST /chat/ask - Main chatbot endpoint
router.post('/ask', async (req, res) => {
  try {
    const { user_id, text, profile } = req.body;
    
    // Validate required fields
    if (!text) {
      return res.status(400).json({ 
        error: 'Missing required field: text',
        response: "I need a message to help you with. What would you like to know?"
      });
    }

    // Process the chat message
    const response = await processChatMessage({
      user_id: user_id || 'anonymous',
      text: text.trim(),
      profile: profile || {}
    });

    res.json(response);
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      response: "I'm having trouble processing your request. Please try again."
    });
  }
});

// GET /chat/me - Get user profile
router.get('/me', (req, res) => {
  res.json({
    user_id: req.query.user_id || 'anonymous',
    profile: {
      diets: [],
      allergens: [],
      max_time: null,
      location: null
    }
  });
});

export default router;