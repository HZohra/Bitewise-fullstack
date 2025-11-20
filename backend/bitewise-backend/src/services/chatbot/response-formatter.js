//This module turns structured action results (from action-handlers.js) 
//into a single user-facing string that your UI can display. 
//It’s the last step in the pipeline: intent → entities → action → format → UI.

export function formatResponse(intent, actionResult, entities) {
  switch (actionResult.type) {
    case 'recipe_list':
      return formatRecipeList(actionResult, entities);
    
    case 'restaurant_list':
      return formatRestaurantList(actionResult, entities);
    
    case 'allergen_warning':
      return formatAllergenWarning(actionResult, entities);
    
    case 'meal_plan':
      return formatMealPlan(actionResult, entities);
    
    case 'substitution_list':
      return formatSubstitutionList(actionResult, entities);
    
    case 'no_results':
      return formatNoResults(actionResult, entities);
    
    case 'error':
      return actionResult.message;
    
    default:
      return actionResult.message || 'I\'m not sure how to help with that. Could you try rephrasing?';
  }
}

function formatRecipeList(result, entities) {
  let response = result.message + '\n\n';
  
  result.recipes.forEach((recipe, index) => {
    response += `${index + 1}. **${recipe.name}**\n`;
    response += `   🕒 ${recipe.time} min | 🔥 ${recipe.calories} cal\n`;
    
    if (recipe.dietLabels.length > 0) {
      response += `   🏷️ ${recipe.dietLabels.join(', ')}\n`;
    }
    
    const shortIngredients = recipe.ingerdients.slice(0, 5).join(', ');
    response += `   🧂 Ingredients: ${shortIngredients}...\n\n`;
  });
  //   response += `   🔗 [View Recipe](${recipe.url})\n\n`;
  // });
  
  // if (result.totalFound > result.recipes.length) {
  //   response += `*Found ${result.totalFound} total recipes. Say "more" to see additional options.*`;
  // }
  
  return response;
}

function formatRestaurantList(result, entities) {
  let response = result.message + '\n\n';
  
  if (result.restaurants.length === 0) {
    response += 'Restaurant search is coming soon! In the meantime, try searching for recipes instead.';
  } else {
    result.restaurants.forEach((restaurant, index) => {
      response += `${index + 1}. **${restaurant.name}**\n`;
      response += `   ⭐ ${restaurant.rating} | 📍 ${restaurant.area}\n`;
      response += `   🔗 [View Details](${restaurant.link})\n\n`;
    });
  }
  
  return response;
}

function formatAllergenWarning(result, entities) {
  let response = result.message + '\n\n';
  
  result.warnings.forEach(warning => {
    response += `⚠️ **${warning.allergen.toUpperCase()} WARNING**\n`;
    response += `${warning.warning}\n`;
    
    if (warning.substitutions.length > 0) {
      response += `💡 **Safe alternatives:** ${warning.substitutions.join(', ')}\n\n`;
    }
  });
  
  response += '*Ask me about specific substitutions for any ingredient!*';
  
  return response;
}

function formatMealPlan(result, entities) {
  let response = result.message + '\n\n';
  
  result.plan.forEach(day => {
    response += `**Day ${day.day}**\n`;
    
    day.meals.forEach(meal => {
      response += `🍽️ **${meal.type.charAt(0).toUpperCase() + meal.type.slice(1)}:** ${meal.name}\n`;
      response += `   🕒 ${meal.time} min | 🔥 ${meal.calories} cal\n`;
      response += `   🔗 [View Recipe](${meal.url})\n\n`;
    });
    
    response += '---\n\n';
  });
  
  response += '*Need a shopping list? Just ask!*';
  
  return response;
}

function formatSubstitutionList(result, entities) {
  let response = result.message + '\n\n';
  
  result.substitutions.forEach(item => {
    response += `**${item.ingredient.charAt(0).toUpperCase() + item.ingredient.slice(1)} Substitutions:**\n`;
    
    item.substitutions.forEach(sub => {
      response += `• **${sub.ingredient}** → ${sub.alternatives.join(', ')}\n`;
      if (sub.notes) {
        response += `  *${sub.notes}*\n`;
      }
    });
    
    response += '\n';
  });
  
  return response;
}

function formatNoResults(result, entities) {
  let response = result.message + '\n\n';
  
  if (result.suggestions) {
    response += '**Try these suggestions:**\n';
    result.suggestions.forEach((suggestion, index) => {
      response += `${index + 1}. ${suggestion}\n`;
    });
  }
  
  return response;
}
