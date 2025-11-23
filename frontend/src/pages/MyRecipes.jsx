// src/pages/MyRecipes.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MyRecipes() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const initial = (user?.name || "B")[0].toUpperCase();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
        setError("You must be logged in to view your recipes.");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5002/my-recipes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recipes.");
      }

      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading recipes:", err);
      setError("Could not load your recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  fetchMyRecipes();
}, []);

  const handleAddFirstRecipe = () => {
    navigate("/add");
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">My Recipes</h1>

      {/* Header card with avatar + name */}
      <div className="bg-white rounded-2xl shadow mb-6 px-8 py-6 flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-semibold">
            {initial}
          </div>
          <div>
            <p className="text-xl font-semibold">
              {user?.name || "BiteWise user"}
            </p>
            <p className="text-sm text-gray-600">
              {user?.email || "Not set"}
            </p>
          </div>
        </div>
      </div>

      {/* Content card */}
      <div className="bg-white rounded-2xl shadow p-6">
        {loading && (
          <p className="text-sm text-gray-600">Loading your recipes...</p>
        )}

        {error && !loading && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-gray-700">
              You haven&apos;t added any recipes yet.
            </p>
            <button
              type="button"
              onClick={handleAddFirstRecipe}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
            >
              Add your first recipe
            </button>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-2">
              You have {recipes.length} recipe
              {recipes.length > 1 ? "s" : ""} saved.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {recipe.title}
                      </h3>
                      {recipe.totalTime != null && (
                        <p className="text-xs text-gray-500">
                          ⏱ {recipe.totalTime} min
                        </p>
                      )}
                      {recipe.servings != null && (
                        <p className="text-xs text-gray-500">
                          🍽 Servings: {recipe.servings}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      {recipe.sourceType === "user"
                        ? "Your recipe"
                        : "Imported"}
                    </span>

                    {/* Link to details page and pass recipe in state */}
                    <Link
                      to={`/recipe/${recipe._id}`}
                      state={recipe}
                      className="text-sm text-emerald-600 font-semibold hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
