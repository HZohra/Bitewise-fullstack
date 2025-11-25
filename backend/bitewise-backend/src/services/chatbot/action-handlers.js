import { fetchRecipes } from '../../config/edamam.js';
import fs from 'fs';

const substitutions = JSON.parse(fs.readFileSync(new URL('./data/substitutions.json', import.meta.url), 'utf8'));
const allergenSignals = JSON.parse(fs.readFileSync(new URL('./data/allergen-signals.json', import.meta.url), 'utf8'));

// Main function to execute action based on intent
// and entities extracted from user input
export async function executeAction(intent, entities, profile) {
  switch (intent) {
    case 'quickSearchRecipes': // Search for recipes based on user criteria
      return await quickSearchRecipes(entities, profile);
    
    case 'quickSearchRestaurants': // Search for restaurants based on user criteria
      return await quickSearchRestaurants(entities, profile);
    
    case 'recipeExplainer':  // Explain recipe safety based on allergens
      return await recipeExplainer(entities, profile);
    
    case 'mealPlanner':  // Generate meal plan based on user preferences
      return await mealPlanner(entities, profile);
    
    case 'substitutions':  // Provide ingredient substitutions
      return await handleSubstitutions(entities, profile);
    
    case 'generalConversation':  // Handle general questions and conversation
      return await handleGeneralConversation(entities, profile);
    
    default: // Unknown intent
      return {
        type: 'error',
        message: 'I didn\'t understand that. Could you try rephrasing your request?'
      };
  }
}

// Action Handlers
async function quickSearchRecipes(entities, profile) {
  try {
    // Build search query
    let query = entities.foodTopic || 'healthy';
    
    // Add meal type to query if specified
    if (entities.mealType) {
      query += ` ${entities.mealType}`;
    }
    
    // Get dietary filters
    const dietFilters = [...entities.dietaryTags, ...(profile.diets || [])];
    
    // Fetch recipes from Edamam
    const data = await fetchRecipes(query, dietFilters);
    
    if (!data.hits || data.hits.length === 0) {
      return {
        type: 'no_results',
        message: 'No recipes found for your search. Try adjusting your criteria.',
        suggestions: ['Try removing some dietary restrictions', 'Search for a different food type', 'Ask for meal planning help']
      };
    }
    
    // Process and filter results
    const recipes = data.hits.slice(0, 3).map(hit => ({
      id: hit.recipe.uri,
      name: hit.recipe.label,
      image: hit.recipe.image,
      calories: Math.round(hit.recipe.calories),
      time: hit.recipe.totalTime || 'N/A',
      dietLabels: hit.recipe.dietLabels || [],
      healthLabels: hit.recipe.healthLabels || [],
      ingredients: hit.recipe.ingredientLines || [],
      source: hit.recipe.source,
      url: hit.recipe.url
    }));
    
    // Filter by time if specified
    let filteredRecipes = recipes;
    if (entities.timeLimit) {
      filteredRecipes = recipes.filter(recipe => 
        recipe.time === 'N/A' || recipe.time <= entities.timeLimit
      );
    }
    
    return {
      type: 'recipe_list',
      recipes: filteredRecipes,
      totalFound: data.hits.length,
      message: `Found ${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''} for you!`
    };
    
  } catch (error) {
    console.error('Error in quickSearchRecipes:', error);
    return {
      type: 'error',
      message: 'Sorry, I couldn\'t search for recipes right now. Please try again later.'
    };
  }
}

async function quickSearchRestaurants(entities, profile) {
  // Placeholder for restaurant search
  // This would integrate with Google Places API or Yelp API
  return {
    type: 'restaurant_list',
    message: 'Restaurant search is coming soon! For now, try searching for recipes instead.',
    restaurants: []
  };
}

async function recipeExplainer(entities, profile) {
  // This would analyze a specific recipe for allergens
  // For now, return general allergen information
  const userAllergens = [...entities.allergens, ...(profile.allergens || [])];
  
  if (userAllergens.length === 0) {
    return {
      type: 'explanation',
      message: 'I can help explain why certain recipes might be unsafe. What specific recipe or ingredient are you concerned about?'
    };
  }
  
  // Generate allergen warnings
  const warnings = userAllergens.map(allergen => {
    const signals = allergenSignals.allergenSignals[allergen] || [];
    return {
      allergen,
      warning: `This recipe may contain ${allergen}-containing ingredients like: ${signals.slice(0, 3).join(', ')}`,
      substitutions: getSubstitutionsForAllergen(allergen)
    };
  });
  
  return {
    type: 'allergen_warning',
    warnings,
    message: 'Here are the potential allergens I found in your request:'
  };
}

async function mealPlanner(entities, profile) {
  const duration = entities.duration || 1; // Default to 1 day
  const mealTypes = entities.mealType ? [entities.mealType] : ['breakfast', 'lunch', 'dinner'];
  const dietaryTags = [...entities.dietaryTags, ...(profile.diets || [])];
  
  const mealPlan = [];
  
  for (let day = 1; day <= duration; day++) {
    const dayPlan = { day, meals: [] };
    
    for (const mealType of mealTypes) {
      try {
        // Search for recipes for this meal type
        const query = `${mealType} healthy`;
        const data = await fetchRecipes(query, dietaryTags);
        
        if (data.hits && data.hits.length > 0) {
          const recipe = data.hits[0].recipe;
          dayPlan.meals.push({
            type: mealType,
            name: recipe.label,
            calories: Math.round(recipe.calories),
            time: recipe.totalTime || 'N/A',
            url: recipe.url
          });
        }
      } catch (error) {
        console.error(`Error planning ${mealType} for day ${day}:`, error);
      }
    }
    
    mealPlan.push(dayPlan);
  }
  
  return {
    type: 'meal_plan',
    plan: mealPlan,
    message: `Here's your ${duration}-day meal plan!`
  };
}

function handleSubstitutions(entities, profile) {
  const ingredients = entities.ingredients;
  const userAllergens = [...entities.allergens, ...(profile.allergens || [])];
  
  if (ingredients.length === 0) {
    return {
      type: 'substitution_help',
      message: 'What ingredient would you like to substitute? For example: "substitute for milk" or "replace butter"'
    };
  }
  
  const results = [];
  
  for (const ingredient of ingredients) {
    const subs = findSubstitutions(ingredient, userAllergens);
    if (subs.length > 0) {
      results.push({
        ingredient,
        substitutions: subs
      });
    }
  }
  
  if (results.length === 0) {
    return {
      type: 'no_substitutions',
      message: `I couldn't find substitutions for ${ingredients.join(', ')}. Try asking about common ingredients like milk, butter, eggs, or flour.`
    };
  }
  
  return {
    type: 'substitution_list',
    substitutions: results,
    message: 'Here are some substitution options for you:'
  };
}

function getSubstitutionsForAllergen(allergen) {
  const allergenSubs = substitutions.substitutions[allergen] || [];
  return allergenSubs.slice(0, 2).map(sub => sub.ingredient);
}

function handleGeneralConversation(entities, profile) {
  const responses = {
    greeting: [
      "Hello! I'm BiteWise, your dietary companion. How can I help you today?",
      "Hi there! I'm here to help with recipes, meal planning, and dietary questions. What would you like to know?",
      "Hey! I'm BiteWise. I can help you find recipes, plan meals, check allergens, and more. What can I do for you?"
    ],
    help: [
      "I can help you with:\n• Finding recipes based on dietary restrictions\n• Meal planning for multiple days\n• Checking allergens in recipes\n• Finding ingredient substitutions\n• Restaurant recommendations\n\nJust ask me anything food-related!",
      "Here's what I can do:\n• Search recipes (e.g., 'Show me vegan pasta')\n• Plan meals (e.g., 'Plan my meals for 3 days')\n• Explain allergens (e.g., 'Why can't I eat this?')\n• Suggest substitutions (e.g., 'Substitute for milk')\n• Find restaurants (e.g., 'Vegan restaurants near me')\n\nWhat would you like help with?"
    ],
    thanks: [
      "You're welcome! Feel free to ask if you need anything else.",
      "Happy to help! Let me know if you have more questions.",
      "Anytime! I'm here whenever you need assistance with food and recipes."
    ],
    goodbye: [
      "Goodbye! Have a great day and enjoy your meals!",
      "See you later! Stay healthy!",
      "Take care! Come back anytime you need recipe help."
    ],
    general: [
      "I'm BiteWise, your AI assistant for all things food and dietary restrictions. I can help you find recipes, plan meals, check for allergens, and suggest ingredient substitutions. What would you like to know?",
      "I specialize in helping people with dietary restrictions find safe and delicious meals. I can search recipes, create meal plans, explain allergens, and suggest alternatives. How can I assist you?",
      "I'm here to make meal planning easier for people with food allergies and dietary restrictions. Ask me about recipes, meal planning, allergens, or substitutions - I'm happy to help!"
    ]
  };

  // Use original text if available, otherwise use foodTopic
  const text = entities.originalText || entities.foodTopic || '';
  const lowerText = text.toLowerCase();

  if (/hello|hi|hey|greetings/i.test(lowerText)) {
    return {
      type: 'conversation',
      message: responses.greeting[Math.floor(Math.random() * responses.greeting.length)]
    };
  }

  if (/help|what.*can.*you|how.*do.*you|what.*you.*do/i.test(lowerText)) {
    return {
      type: 'conversation',
      message: responses.help[Math.floor(Math.random() * responses.help.length)]
    };
  }

  if (/thanks|thank you|appreciate/i.test(lowerText)) {
    return {
      type: 'conversation',
      message: responses.thanks[Math.floor(Math.random() * responses.thanks.length)]
    };
  }

  if (/bye|goodbye|see you|later/i.test(lowerText)) {
    return {
      type: 'conversation',
      message: responses.goodbye[Math.floor(Math.random() * responses.goodbye.length)]
    };
  }

  // Try to provide helpful responses for common questions
  if (/what.*is.*bitewise|what.*are.*you|who.*are.*you/i.test(lowerText)) {
    return {
      type: 'conversation',
      message: "I'm BiteWise, an AI assistant designed to help people with dietary restrictions and food allergies. I can help you find safe recipes, plan meals, check for allergens, and suggest ingredient substitutions. How can I assist you today?"
    };
  }

  if (/how.*work|how.*do.*you|what.*can.*you.*do/i.test(lowerText)) {
    return {
      type: 'conversation',
      message: responses.help[Math.floor(Math.random() * responses.help.length)]
    };
  }

  // For questions about food/nutrition that aren't recipe searches
  if (/what.*is.*good.*for|healthy.*food|nutrition|vitamin|protein|calorie/i.test(lowerText)) {
    return {
      type: 'conversation',
      message: "I can help you find healthy recipes and nutritional information! Try asking me things like:\n• 'Show me high-protein recipes'\n• 'Find low-calorie meals'\n• 'What are good sources of [nutrient]'\n\nOr I can search for specific recipes that match your dietary needs. What would you like to know?"
    };
  }

  // Friendly response for anything else
  return {
    type: 'conversation',
    message: "I'm BiteWise, your dietary companion! I specialize in helping with recipes, meal planning, and dietary restrictions. While I'm best at food-related questions, I'm here to help however I can.\n\nTry asking me:\n• 'Show me vegan recipes'\n• 'Plan my meals for 2 days'\n• 'What can I substitute for eggs?'\n• 'Why can't I eat this dish?'\n\nWhat would you like help with?"
  };
}

function findSubstitutions(ingredient, userAllergens) {
  const results = [];
  
  for (const [allergen, subs] of Object.entries(substitutions.substitutions)) {
    for (const sub of subs) {
      if (sub.ingredient.toLowerCase().includes(ingredient.toLowerCase())) {
        // Filter out substitutions that contain user's allergens
        const safeSubs = sub.alternatives.filter(alt => 
          !userAllergens.some(allergen => 
            allergenSignals.allergenSignals[allergen]?.some(signal => 
              alt.toLowerCase().includes(signal.toLowerCase())
            )
          )
        );
        
        if (safeSubs.length > 0) {
          results.push({
            ...sub,
            alternatives: safeSubs.slice(0, 3)
          });
        }
      }
    }
  }
  
  return results;
}
