
import axios from 'axios'; // HTTP client request
import dotenv from 'dotenv'; // Load environment variables
dotenv.config();

const EDAMAM_BASE_URL = 'https://api.edamam.com/api/recipes/v2';

// this function CONTACTS the Edamam API to fetch recipes
export async function fetchRecipes(query, dietFilters = []) {
  const params = new URLSearchParams({
    type: 'public',
    q: query,
    app_id: process.env.EDAMAM_APP_ID,
    app_key: process.env.EDAMAM_APP_KEY,
  });

  // Optional filters (vegan, gluten-free, etc.)
  dietFilters.forEach(f => params.append('health', f));

  try {
    const response = await axios.get(`${EDAMAM_BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching from Edamam:', err.message);
    throw err;
  }
}
