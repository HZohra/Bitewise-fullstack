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
    // ---------------------------------------------------------
    // 0) Special case: multi-day meal plan requests
    // ---------------------------------------------------------
    const lowerText = text.toLowerCase();

    if (lowerText.includes('meal plan') || lowerText.includes('plan my meal')) {
      const plan = buildTwoDayMealPlan(profile);

      return {
        user_id: user_id || 'anonymous',
        response: plan,
        recipes: []  // you can later attach structured recipes here if you want
      };
    }

    // ---------------------------------------------------------
    // 1) Default path: recipe search via Edamam
    // ---------------------------------------------------------

    // Extract simple query from user text
    // Example: "Show me a vegan dinner under 30 min" -> "vegan dinner"
    let query = text;

    // Remove common phrases to get cleaner query
    query = query
      .replace(/show me/i, '')
      .replace(/find me/i, '')
      .replace(/give me/i, '')
      .replace(/under \d+ min/i, '')
      .replace(/within \d+ min/i, '')
      .replace(/\brecipes?\b/i, '')
      .trim();

    // If query is empty, use original text
    if (!query || query.length < 2) {
      query = text;
    }

    console.log('Simplified query:', query);

    const appId = process.env.EDAMAM_APP_ID;
    const appKey = process.env.EDAMAM_APP_KEY;

    const url = new URL('https://api.edamam.com/api/recipes/v2');
    url.searchParams.append('type', 'public');
    url.searchParams.append('q', query);
    url.searchParams.append('app_id', appId);
    url.searchParams.append('app_key', appKey);

    console.log('Edamam URL:', url.toString());

    const response = await fetch(url.toString());

    console.log('Edamam HTTP status:', response.status);
    const data = await response.json();

    console.log(
      'Edamam raw preview:',
      JSON.stringify(data).slice(0, 200)
    );
    console.log('Edamam response hits:', data.hits?.length || 0);

    // Handle API error
    if (!response.ok) {
      return {
        user_id: user_id,
        response: "I'm having trouble talking to the recipe server. Please try again.",
        recipes: []
      };
    }

    // Handle no recipes found
    if (!data.hits || data.hits.length === 0) {
      return {
        user_id: user_id,
        response: "Sorry, I couldn't find any recipes matching your criteria. Try a different search (for example: 'quick vegan dinner').",
        recipes: []
      };
    }

    // Extract richer recipe info (NO URLs, MORE details)
    const recipes = data.hits.slice(0, 3).map(hit => ({
      label: hit.recipe.label,
      time: hit.recipe.totalTime,                       // in minutes
      calories: Math.round(hit.recipe.calories),
      dietLabels: hit.recipe.dietLabels || [],
      healthLabels: hit.recipe.healthLabels || [],
      ingredients: hit.recipe.ingredientLines || []     // full ingredient list
    }));

    // Build a ChatGPT-style text response (summary + details, no links)
    let fullResponse = `Here are ${recipes.length} recipes I found for "${query}":\n\n`;

    recipes.forEach((r, index) => {
      const timeText = r.time ? `${r.time} minutes` : 'time not available';
      const dietText = r.dietLabels.length > 0 ? r.dietLabels.join(', ') : 'not specified';
      const healthText = r.healthLabels.length > 0 ? r.healthLabels.slice(0, 5).join(', ') : 'not specified';

      fullResponse +=
        `${index + 1}. ${r.label}\n` +
        `   • Time: ${timeText}\n` +
        `   • Calories (whole recipe): ~${r.calories}\n` +
        `   • Diet: ${dietText}\n` +
        `   • Health: ${healthText}\n` +
        `   • Ingredients:\n` +
        r.ingredients.map(ing => `     - ${ing}`).join('\n') +
        `\n\n`;
    });

    fullResponse += `If you want, you can ask for things like "faster recipes", "high-protein vegan", or "gluten-free dessert".`;

    // Final return: natural language + structured data
    return {
      user_id: user_id,
      response: fullResponse.trim(),
      recipes: recipes
    };

  } catch (error) {
    console.error('processChatMessage error:', error);
    return {
      user_id: user_id,
      response: "I'm having trouble finding recipes. Please try again.",
      recipes: []
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
