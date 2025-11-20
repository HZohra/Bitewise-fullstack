// src/services/edamam.js
const axios = require("axios");

async function searchEdamamRecipes(query) {
  const url = "https://api.edamam.com/api/recipes/v2";

  try {
    const response = await axios.get(url, {
      params: {
        type: "public",
        q: query,
        app_id: process.env.EDAMAM_APP_ID,
        app_key: process.env.EDAMAM_APP_KEY,
      },
    });

    // This is the "where should I put this?" part:
    console.log("Edamam status:", response.status);
    console.log(
      "Edamam preview:",
      JSON.stringify(response.data).slice(0, 200)
    );

    return response.data;
  } catch (err) {
    console.error("Edamam ERROR:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { searchEdamamRecipes };
