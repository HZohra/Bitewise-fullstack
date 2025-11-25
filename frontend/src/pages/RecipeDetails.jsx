// src/pages/RecipeDetails.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RecipeDetails() {
  const { state: recipe } = useLocation();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(savedFavorites.some((fav) => fav.id === recipe?.id));
  }, [recipe]);

  if (!recipe) {
    return (
      <p className="text-center text-gray-500 mt-20">
        No recipe data found.
      </p>
    );
  }

  //add or remove from favs
  const toggleFavorite = () => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let updatedFavorites;

    if (isFavorite) {
      updatedFavorites = savedFavorites.filter((fav) => fav.id !== recipe.id);
    } else {
      updatedFavorites = [...savedFavorites, recipe];
    }

    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
  };

  //share feature
  const handleShare = () => {
    const shareData = {
      title: recipe.name,
      text: `Check out this recipe: ${recipe.name}`,
      url: window.location.href, // uses live Vercel link after deploy
    };

    if (navigator.share) {
      navigator
        .share(shareData)
        .catch((error) => console.error("Share failed:", error));
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-teal-600 font-semibold mb-4"
      >
        ← Back
      </button>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-teal-700">{recipe.name}</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm bg-teal-500 text-white px-3 py-2 rounded-lg hover:bg-teal-600 transition"
          >
            Share
          </button>
          <button
            onClick={toggleFavorite}
            className={`text-2xl transition ${
              isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-400"
            }`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
      </div>

      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />

    
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <p className="text-sm text-gray-700">
          <strong>Servings:</strong> {recipe.yield || "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Cuisine Type:</strong>{" "}
          {recipe.cuisineType?.join(", ") || "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Meal Type:</strong> {recipe.mealType?.join(", ") || "N/A"}
        </p>
        <p className="text-sm text-gray-700">
          <strong>Dish Type:</strong> {recipe.dishType?.join(", ") || "N/A"}
        </p>
      </div>

    
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h2 className="font-semibold text-lg mb-2">Ingredients</h2>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

    
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h2 className="font-semibold text-lg mb-2">Nutritional Information</h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          {recipe.totalNutrients &&
            Object.entries(recipe.totalNutrients).map(([key, nutrient]) => (
              <p key={key}>
                <strong>{nutrient.label}:</strong>{" "}
                {Math.round(nutrient.quantity)} {nutrient.unit}
              </p>
            ))}
        </div>
      </div>

  
      <div className="bg-white rounded-xl shadow p-4 mb-4">
        <h2 className="font-semibold text-lg mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {recipe.healthLabels?.map((label) => (
            <span
              key={label}
              className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {label}
            </span>
          ))}
          {recipe.dietLabels?.map((label) => (
            <span
              key={label}
              className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

    
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-2">Preparation Details</h2>
        <p className="text-sm text-gray-600">
          <strong>Total Time:</strong>{" "}
          {recipe.totalTime ? `${recipe.totalTime} mins` : "N/A"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Source:</strong> {recipe.source || "N/A"}
        </p>
        <p className="text-sm text-gray-700">
        Edamam does not provide step-by-step instructions. Please visit the source below for full preparation details.
        </p>
      
        {recipe.url && (
          <p className="text-sm mt-1">
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 underline"
            >
              View original recipe source ↗
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
