import express from "express";
import { fetchRecipes } from "../config/edamam.js";

const router = express.Router();

// GET /recipes?q=pasta&filters=vegan,gluten-free
router.get("/", async (req, res) => {
  try {
    const { q, filters } = req.query;

    const dietFilters = filters ? String(filters).split(",") : [];
    
    console.log('Recipe search query:', q);
    console.log('Requested filters:', dietFilters);

    const data = await fetchRecipes(q, dietFilters);

    // data is the raw Edamam response (with "hits")
    res.json(data);
  } catch (error) {
    const status = error.response?.status;

    console.error(
      "Error in /recipes route:",
      status,
      error.response?.data || error.message
    );

    // Edamam rate limit reached
    if (status === 429) {
      // Option A: just send an error
      return res
        .status(429)
        .json({ error: "Edamam rate limit reached. Please try again later." });

      // Option B (if you want to keep testing UI):
      // return res.json({
      //   hits: [
      //     {
      //       recipe: {
      //         uri: "mock-1",
      //         label: "Mock Healthy Recipe",
      //         image: "https://via.placeholder.com/300",
      //         calories: 500,
      //         dietLabels: ["Low-Fat"],
      //         healthLabels: ["Vegetarian"],
      //         ingredientLines: ["1 cup mock ingredient"],
      //         source: "Mock Source",
      //         url: "#",
      //       },
      //     },
      //   ],
      // });
    }

    // Any other error
    return res
      .status(500)
      .json({ error: "Failed to fetch recipes from Edamam." });
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
