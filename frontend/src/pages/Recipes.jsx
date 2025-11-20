import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Recipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  // const [searchTerm, setSearchTerm] = useState("healthy");
  
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem("recipesSearchTerm") || "";
  });


  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dietary filters matching backend dietary-mappings.json
  const filters = [
    "Vegan",
    "Vegetarian", 
    "Gluten-Free",
    "Dairy-Free",
    "Tree-Nut-Free",
    "Keto-Friendly",
    "Paleo",
    "Low-Carb",
    "Low-Sugar",
    "Low-Sodium",
    "High-Protein",
    "Low-Fat",
    "Shellfish-Free",
    "Crustacean-Free",
    "Fish-Free",
    "Mollusk-Free",
    "Egg-Free",
    "Soy-Free",
    "Sesame-Free"
  ];

  //added it here
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    localStorage.setItem("recipesSearchTerm", value);
  };

  const handleSearchSubmit = (e) => {
  e.preventDefault();
  fetchRecipes();  // run the search only when user clicks Search
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedFilters([]);
    localStorage.removeItem("recipesSearchTerm");
    setRecipes([]);  // Clear current recipes
  };


  //I think we should remove these, since we do not use it and it expose the API(Zohra)
  // const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
  // const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;

  const fetchRecipes = async (
    term = searchTerm,
   filtersForSearch = selectedFilters
  ) => {
    setLoading(true);
    try {
      let url = `http://localhost:5002/recipes?q=${encodeURIComponent(searchTerm)}`;

      if (selectedFilters.length > 0) {
      const filterString = selectedFilters
        .map((f) => f.toLowerCase().replace(/\s+/g, "-"))
        .join(",");
      url += `&filters=${filterString}`;
}

      const response = await fetch(url);
      const data = await response.json();


      //see exactly what backend returns
      console.log("Edamam /recipes response:", data);

      const mapped = data.hits?.map((hit) => ({
        id: hit.recipe.uri,
        name: hit.recipe.label,
        image: hit.recipe.image,
        calories: Math.round(hit.recipe.calories),
        dietLabels: hit.recipe.dietLabels,
        healthLabels: hit.recipe.healthLabels,
        ingredients: hit.recipe.ingredientLines,
        source: hit.recipe.source,
        url: hit.recipe.url,
      })) || [];

      setRecipes(mapped);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };


  //this calls API everytime user types a letter - bad for performance
  // useEffect(() => {
  //   fetchRecipes();
  // }, [searchTerm, selectedFilters]);

  const toggleFilter = (filter) => {
    let updatedFilters;

    if (selectedFilters.includes(filter)) {
    updatedFilters = selectedFilters.filter((f) => f !== filter);
  } else {
    updatedFilters = [...selectedFilters, filter];
  }

  setSelectedFilters(updatedFilters);

  // immediately search with current text + updated filters
  fetchRecipes(searchTerm, updatedFilters);
};

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${encodeURIComponent(recipe.id)}`, { state: recipe });
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 relative">
    {/* Search Bar */}
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <form onSubmit={handleSearchSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="What recipe are you looking for?"
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium whitespace-nowrap"
          >
            Reset Filters
          </button>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mt-3 max-h-32 overflow-y-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button" // so clicking filter doesn't submit the form
              onClick={() => toggleFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition
                ${
                  selectedFilters.includes(filter)
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200"
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </form>
    </div>


      {/* Recipe Grid */}
      {loading ? (
        <p className="text-center text-gray-500 mt-20">Loading recipes...</p>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 pb-24">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe)}
              className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition p-3"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="rounded-lg mb-2 object-cover w-full h-32"
              />
              <h3 className="text-sm font-semibold text-gray-800 text-center">
                {recipe.name}
              </h3>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-20">
          No recipes found for your search.
        </p>
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => navigate("/add")}
        className="fixed bottom-6 right-6 bg-teal-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-teal-700 transition-all duration-200"
        title="Add Recipe"
      >
        +
      </button>
    </div>
  );
}
