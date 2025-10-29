// Intent detection patterns
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
  
  // Default to quick search if no specific intent detected
  return 'quickSearchRecipes';
}