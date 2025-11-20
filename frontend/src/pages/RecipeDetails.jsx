import { useLocation, useNavigate } from "react-router-dom";

export default function RecipeDetails() {
  const { state: recipe } = useLocation();
  const navigate = useNavigate();

  if (!recipe) {
    return (
      <p className="text-center text-gray-500 mt-20">No recipe data found.</p>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <button
        onClick={() => navigate(-1)}
        className="text-teal-600 font-semibold mb-4"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-teal-700 mb-4">{recipe.name}</h1>
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
