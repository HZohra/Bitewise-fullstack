import { apiRequest } from "./config.js";

// Get user's saved recipes
export const getMyRecipes = async () => {
  return apiRequest("/my-recipes");
};

// Add a new recipe
export const addRecipe = async (recipeData) => {
  return apiRequest("/my-recipes", {
    method: "POST",
    body: JSON.stringify(recipeData),
  });
};

// Update a recipe
export const updateRecipe = async (recipeId, recipeData) => {
  return apiRequest(`/my-recipes/${recipeId}`, {
    method: "PUT",
    body: JSON.stringify(recipeData),
  });
};

// Delete a recipe
export const deleteRecipe = async (recipeId) => {
  return apiRequest(`/my-recipes/${recipeId}`, {
    method: "DELETE",
  });
};

