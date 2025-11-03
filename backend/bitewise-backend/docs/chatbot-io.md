# BiteWise Chatbot – Input & Output Contract (Zohra)

This file defines the single **input** the chatbot receives and the single **output** it always returns.  
Keep this shape stable so the frontend ↔ backend stay in sync.

---

##1 Chatbot Input JSON

```json
{
  "user_id": "optional-123",
  "text": "Show me a vegan dinner under 30 min",
  "profile": {
    "diets": ["vegan"],
    "allergens": ["peanut"],
    "max_time": 30
  }
}

