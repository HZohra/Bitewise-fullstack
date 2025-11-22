import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${encodeURIComponent(recipe.id)}`, { state: recipe });
  };

  const clearFavorites = () => {
    localStorage.removeItem("favorites");
    setFavorites([]);
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-teal-700">My Favorites ❤️</h1>
        {favorites.length > 0 && (
          <button
            onClick={clearFavorites}
            className="text-sm text-red-500 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <p className="text-gray-500 mt-10 text-center">
          No favorites yet. Click ❤️ on a recipe to save it!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favorites.map((recipe) => (
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
      )}
    </div>
  );
}
