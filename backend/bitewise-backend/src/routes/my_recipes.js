// src/routes/my_recipes.js
import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  createUserRecipe,
  getRecipesByUser,
  getUserRecipeById,
  updateUserRecipe,
  deleteUserRecipe,
} from "../services/recipeService.js";

const router = express.Router();

/**
 * GET /my-recipes
 * Get all recipes for the logged-in user
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipes = await getRecipesByUser(userId);

    return res.json(recipes);
  } catch (err) {
    console.error("Error in GET /my-recipes:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * POST /my-recipes
 * Create a new recipe for the logged-in user
 * Body: { title, description?, image?, ingredients?, instructions?, totalTime?, servings?, dietLabels?, healthLabels? }
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      title,
      description,
      image,
      ingredients,
      instructions,
      totalTime,
      servings,
      dietLabels,
      healthLabels,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required." });
    }

    const recipe = await createUserRecipe(userId, {
      title,
      description,
      image,
      ingredients,
      instructions,
      totalTime,
      servings,
      dietLabels,
      healthLabels,
    });

    return res.status(201).json(recipe);
  } catch (err) {
    console.error("Error in POST /my-recipes:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * GET /my-recipes/:id
 * Get single recipe owned by user
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;

    const recipe = await getUserRecipeById(userId, recipeId);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    return res.json(recipe);
  } catch (err) {
    console.error("Error in GET /my-recipes/:id:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * PATCH /my-recipes/:id
 * Update an existing recipe (only if owned by the user)
 */
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;

    const updated = await updateUserRecipe(userId, recipeId, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    return res.json(updated);
  } catch (err) {
    console.error("Error in PATCH /my-recipes/:id:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * DELETE /my-recipes/:id
 * Delete a recipe (only if owned by the user)
 */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const recipeId = req.params.id;

    const deleted = await deleteUserRecipe(userId, recipeId);
    if (!deleted) {
      return res.status(404).json({ error: "Recipe not found." });
    }

    return res.json({ message: "Recipe deleted successfully." });
  } catch (err) {
    console.error("Error in DELETE /my-recipes/:id:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
