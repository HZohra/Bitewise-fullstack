// src/services/recipeService.js
import { Recipe } from "../models/recipeModel.js";

/**
 * Create a new recipe for a given user.
 */
export async function createUserRecipe(userId, data) {
  const recipe = await Recipe.create({
    title: data.title,
    description: data.description || "",
    image: data.image || null,
    sourceType: "user",
    ingredients: data.ingredients || [],
    instructions: data.instructions || [],
    totalTime: data.totalTime ?? null,
    servings: data.servings ?? null,
    dietLabels: data.dietLabels || [],
    healthLabels: data.healthLabels || [],
    createdBy: userId,
  });

  return recipe;
}

/**
 * Get all recipes created by a specific user.
 */
export async function getRecipesByUser(userId) {
  const recipes = await Recipe.find({ createdBy: userId })
    .sort({ createdAt: -1 })
    .exec();

  return recipes;
}

/**
 * Get single recipe, ensuring it belongs to given user.
 */
export async function getUserRecipeById(userId, recipeId) {
  const recipe = await Recipe.findOne({
    _id: recipeId,
    createdBy: userId,
  }).exec();

  return recipe;
}

/**
 * Update a user-owned recipe.
 */
export async function updateUserRecipe(userId, recipeId, updates) {
  const recipe = await Recipe.findOneAndUpdate(
    { _id: recipeId, createdBy: userId },
    {
      $set: {
        title: updates.title,
        description: updates.description,
        image: updates.image,
        ingredients: updates.ingredients,
        instructions: updates.instructions,
        totalTime: updates.totalTime,
        servings: updates.servings,
        dietLabels: updates.dietLabels,
        healthLabels: updates.healthLabels,
      },
    },
    { new: true }
  ).exec();

  return recipe;
}

/**
 * Delete a user-owned recipe.
 */
export async function deleteUserRecipe(userId, recipeId) {
  const recipe = await Recipe.findOneAndDelete({
    _id: recipeId,
    createdBy: userId,
  }).exec();

  return recipe;
}
