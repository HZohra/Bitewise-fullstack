// Intent detection patterns for chatbot to classify user messages into intents before any data extraction or API calls.


const INTENT_PATTERNS = {
  quickSearchRecipes: [
    /show me.*recipe/i,
    /find.*recipe/i,
    /search.*recipe/i,
    /recipe.*for/i,
    /what.*cook/i,
    /dinner.*idea/i,
    /breakfast.*idea/i,
    /lunch.*idea/i,
    /meal.*idea/i,
    /cook.*tonight/i,
    /make.*for/i
  ],
  quickSearchRestaurants: [
    /restaurant/i,
    /where.*eat/i,
    /near me/i,
    /nearby/i,
    /local.*food/i,
    /dining/i,
    /place.*eat/i,
    /food.*near/i
  ],
  recipeExplainer: [
    /why.*can.*t.*eat/i,
    /why.*unsafe/i,
    /explain.*recipe/i,
    /what.*wrong.*with/i,
    /allergen/i,
    /allergy/i,
    /safe.*to.*eat/i,
    /substitute/i,
    /replacement/i,
    /instead.*of/i
  ],
  mealPlanner: [
    /plan.*meal/i,
    /meal.*plan/i,
    /plan.*for.*day/i,
    /weekly.*meal/i,
    /menu.*plan/i,
    /meal.*prep/i,
    /shopping.*list/i,
    /grocery.*list/i
  ],
  substitutions: [
    /substitute.*for/i,
    /replace.*with/i,
    /instead.*of/i,
    /alternative.*to/i,
    /what.*use.*instead/i,
    /sub.*for/i
  ],
  generalConversation: [
    /hello/i,
    /hi/i,
    /hey/i,
    /how are you/i,
    /what can you do/i,
    /help/i,
    /thanks/i,
    /thank you/i,
    /bye/i,
    /goodbye/i,
    /what.*you/i,
    /who.*you/i,
    /tell me/i,
    /explain/i,
    /what is/i,
    /how does/i,
    /why/i,
    /when/i,
    /where/i
  ]
};

export function detectIntent(text) {
  const lowerText = text.toLowerCase();
  
  // Check each intent pattern
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(lowerText)) {
        return intent;
      }
    }
  }
  
  // Check if it's a general question (contains question words but no food keywords)
  const foodKeywords = ['recipe', 'food', 'meal', 'cook', 'eat', 'dinner', 'lunch', 'breakfast', 'ingredient', 'allergen', 'diet', 'vegan', 'restaurant'];
  const hasFoodKeyword = foodKeywords.some(keyword => lowerText.includes(keyword));
  const isQuestion = /^(what|how|why|when|where|who|can|do|is|are|will|would|should)/i.test(lowerText.trim());
  
  // If it's a question but not food-related, treat as general conversation
  if (isQuestion && !hasFoodKeyword) {
    return 'generalConversation';
  }
  
  // If no specific intent and no food keywords, treat as general conversation
  if (!hasFoodKeyword) {
    return 'generalConversation';
  }
  
  // Default to quick search if no specific intent detected but has food keywords
  return 'quickSearchRecipes';
}