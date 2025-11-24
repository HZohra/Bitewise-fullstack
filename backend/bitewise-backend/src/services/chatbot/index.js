// Main chatbot processing module that integrates intent detection, entity extraction, action execution, and response formatting.

//4 main steps(pipelines):
//1. Detect user intent from message (Calls detectIntent(text))
//2. Extract entities from message  (Calls extractEntities(text, profile))
//3. Execute action based on intent and entities (Calls executeAction(intent, entities, profile))
//4. Format response to send back to user  (Calls formatResponse(intent, actionResult, entities))

import { detectIntent } from './intent-detector.js';
import { extractEntities } from './entity-extractor.js';
import { executeAction } from './action-handlers.js';
import { formatResponse } from './response-formatter.js';

export async function processChatMessage(input) {
  const { user_id, text, profile } = input;

  try {
    // Step 1: Detect user intent
    const intent = detectIntent(text);
    
    // Step 2: Extract entities from the message
    const entities = extractEntities(text, profile);
    // Store original text in entities for general conversation
    entities.originalText = text;
    
    // Step 3: Execute the appropriate action based on intent
    const actionResult = await executeAction(intent, entities, profile);
    
    // Step 4: Format the response
    const response = formatResponse(intent, actionResult, entities);
    
    return {
      user_id: user_id || 'anonymous',
      intent,
      entities,
      response,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing chat message:', error);
    return {
      user_id: user_id || 'anonymous',
      intent: 'error',
      entities: {},
      response: "I'm sorry, I encountered an error processing your request. Please try again.",
      timestamp: new Date().toISOString()
    };
  }
}

// ---------------------------------------------------------
// Helper: simple static 2-day meal plan (PantryChef-style)
// ---------------------------------------------------------
function buildTwoDayMealPlan(profile) {
  // Later you can use profile (diets, allergens, etc.) to customize this.
  const text = `
📅 Day 1
🥣 Breakfast – Veggie Scramble with Toast & Avocado
- Eggs or tofu, spinach, bell pepper, onion, whole-grain toast, 1/2 avocado
- Optional: Add turmeric & cumin for flavor
- Time: ~15 mins

🍽️ Lunch – Mediterranean Chickpea Salad
- Chickpeas, cucumber, tomato, red onion, olives, feta (or vegan alternative), lemon–olive oil dressing
- Serve chilled or at room temperature
- Prep time: ~10 mins (no cooking)

🍲 Dinner – Vegetable Spaghetti with Zucchini, Tomato & Garlic
- Whole wheat spaghetti, sautéed zucchini, cherry tomatoes, garlic, olive oil, basil
- Optional: Grated Parmesan or nutritional yeast
- Time: ~25 mins

🍎 Snack – Greek yogurt with honey and chia seeds
- Use dairy-free yogurt if needed



📅 Day 2
🥣 Breakfast – Overnight Oats with Banana & Peanut Butter
- Rolled oats, plant milk, banana, peanut butter, cinnamon
- Prep the night before, eat in the morning
- Hands-on time: ~2 mins (night before)

🍽️ Lunch – Quinoa Buddha Bowl
- Cooked quinoa, roasted sweet potato, steamed broccoli, edamame, tahini dressing
- Optional: Sesame seeds or chopped nuts on top
- Time: ~30 mins (can be meal-prepped)

🍲 Dinner – Lentil Curry with Rice
- Brown or red lentils, tomatoes, onion, garlic, ginger, coconut milk, curry spices
- Serve with basmati rice or naan
- Time: ~30 mins

🍇 Snack – Mixed nuts + 1 apple
- Optional: a small square of dark chocolate


💡 Tip: If you tell me your goals (weight loss, high-protein, vegetarian, etc.), I can adjust this plan to fit you better.
`.trim();

  return text;
}
