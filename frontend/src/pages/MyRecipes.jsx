// page for user that stores recipe

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MyRecipes() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('You must be logged in to view your recipes');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5002/my-recipes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError(err.message || 'Failed to load recipes');
      } finally {
        setLoading(false);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe._id}`, { state: recipe });
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h2 className="text-3xl text-center mb-6 text-teal-600 font-bold">
        My Recipes 🍲
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500 mt-20">Loading your recipes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          No saved recipes yet. Go add one!
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {recipes.map((r) => (
            <div
              key={r._id}
              onClick={() => handleRecipeClick(r)}
              className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer p-3 transition"
            >
              {r.image && (
                <img 
                  src={r.image} 
                  alt={r.title} 
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
              )}
              <h3 className="font-semibold text-center text-gray-700">
                {r.title}
              </h3>
              {r.description && (
                <p className="text-sm text-gray-500 text-center mt-1 line-clamp-2">
                  {r.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
