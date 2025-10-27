// page for user that stores recipe

import { useNavigate } from "react-router-dom";

export default function MyRecipes() {
  const navigate = useNavigate();
  const recipes = JSON.parse(localStorage.getItem("myRecipes")) || [];

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: recipe }); // ✅ fixed template literal
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h2 className="text-3xl text-center mb-6 text-teal-600 font-bold">
        My Recipes 🍲
      </h2>

      {recipes.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No saved recipes yet. Go add one!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {recipes.map((r) => (
            <div
              key={r.id}
              onClick={() => handleRecipeClick(r)}
              className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer p-3 transition"
            >
              <h3 className="font-semibold text-center text-gray-700">
                {r.name}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
