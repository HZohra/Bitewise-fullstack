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

      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-2">Ingredients</h2>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Calories:</strong> {recipe.calories}
        </p>
        <p>
          <strong>Diet Labels:</strong>{" "}
          {recipe.dietLabels?.length ? recipe.dietLabels.join(", ") : "N/A"}
        </p>
        <p>
          <strong>Source:</strong>{" "}
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 underline"
          >
            View full recipe
          </a>
        </p>
      </div>
    </div>
  );
}
