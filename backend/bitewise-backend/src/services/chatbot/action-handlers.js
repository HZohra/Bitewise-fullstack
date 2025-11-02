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
