import { apiRequest } from "./config.js";

// Search recipes
export const searchRecipes = async (query, filters = []) => {
  const filterString = filters.length > 0 
    ? filters.map(f => f.toLowerCase().replace(/\s+/g, "-")).join(",")
    : "";
  
  const params = new URLSearchParams({ q: query });
  if (filterString) {
    params.append("filters", filterString);
  }

  return apiRequest(`/recipes?${params.toString()}`);
};

// Get recipe details
export const getRecipeDetails = async (recipeId) => {
  return apiRequest(`/recipes/${recipeId}`);
};

