import express from "express";
import { fetchRecipes } from "../config/edamam.js";
import { Recipe } from "../models/recipeModel.js";

const router = express.Router();

// GET /recipes?q=pasta&filters=vegan,gluten-free
router.get("/", async (req, res) => {
  try {
    const { q, filters } = req.query;

    const dietFilters = filters ? String(filters).split(",") : [];
    
    console.log('Recipe search query:', q);
    console.log('Requested filters:', dietFilters);

    // Fetch Edamam recipes
    let edamamHits = [];
    try {
      const data = await fetchRecipes(q, dietFilters);
      edamamHits = data.hits || [];
    } catch (error) {
      console.error("Error fetching from Edamam:", error.message);
      // Continue even if Edamam fails - we can still show user recipes
    }

    // Fetch user-created recipes from MongoDB
    let userRecipes = [];
    try {
      const query = {};
      
      // Search by title or ingredients if search term provided
      if (q && q.trim()) {
        query.$or = [
          { title: { $regex: q, $options: 'i' } },
          { ingredients: { $regex: q, $options: 'i' } }
        ];
      }

      userRecipes = await Recipe.find(query).exec();

      // Apply diet/health filters to user recipes
      if (dietFilters.length > 0) {
        userRecipes = userRecipes.filter(recipe => {
          const recipeLabels = [
            ...(recipe.dietLabels || []),
            ...(recipe.healthLabels || [])
          ].map(label => label.toLowerCase().replace(/\s+/g, '-'));

          return dietFilters.some(filter => 
            recipeLabels.includes(filter.toLowerCase())
          );
        });
      }
    } catch (error) {
      console.error("Error fetching user recipes:", error.message);
    }

    // Transform user recipes to match Edamam format
    const userRecipeHits = userRecipes.map(recipe => ({
      recipe: {
        uri: `user-recipe-${recipe._id}`,
        label: recipe.title,
        image: recipe.image || 'https://via.placeholder.com/300?text=No+Image',
        calories: 0, // User recipes don't have calories calculated
        dietLabels: recipe.dietLabels || [],
        healthLabels: recipe.healthLabels || [],
        ingredientLines: recipe.ingredients || [],
        source: 'User Recipe',
        url: null,
        isUserRecipe: true,
        _id: recipe._id
      }
    }));

    // Merge both sources - put user recipes first
    const allHits = [...userRecipeHits, ...edamamHits];

    // Return in Edamam format
    res.json({ hits: allHits });
  } catch (error) {
    console.error("Error in /recipes route:", error);
    return res
      .status(500)
      .json({ error: "Failed to fetch recipes." });
  }
});

export default router;






// // Example: GET /recipes?q=pasta&filters=vegan,gluten-free
// router.get('/', async (req, res) => {
//   try {
//     const { q, filters } = req.query;
//     const dietFilters = filters ? filters.split(',') : [];
//     const data = await fetchRecipes(q, dietFilters);
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch recipes' });
//   }
// });

// export default router;
