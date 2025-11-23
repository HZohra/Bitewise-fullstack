import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddRecipe() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    ingredients: '',
    instructions: '',
    servings: '',
    totalTime: ''
  });
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dietary filters matching backend dietary-mappings.json (same as Recipes page)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleFilter = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Recipe name is required');
      return;
    }

    if (!formData.ingredients.trim()) {
      setError('Ingredients are required');
      return;
    }

    setLoading(true);

    try {
      // Parse ingredients and instructions into arrays
      const ingredientsArray = formData.ingredients
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const instructionsArray = formData.instructions
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      // Prepare the recipe data
      const recipeData = {
        title: formData.title,
        description: formData.description || '',
        image: formData.image || null,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        servings: formData.servings ? parseInt(formData.servings) : null,
        totalTime: formData.totalTime ? parseInt(formData.totalTime) : null,
        // Combine all selected filters into healthLabels
        // (You could also split them between dietLabels and healthLabels based on type)
        healthLabels: selectedFilters,
        dietLabels: []
      };

      // Get auth token from localStorage
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('You must be logged in to add a recipe');
        setLoading(false);
        return;
      }

      // POST to backend
      const response = await fetch('http://localhost:5002/my-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recipeData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add recipe');
      }

      // Success! Navigate to recipes page
      alert('Recipe added successfully!');
      navigate('/recipes');
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError(err.message || 'Failed to add recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-20 max-w-2xl mx-auto px-4 pb-8">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-8">Add Your Recipe</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipe Name */}
        <div>
          <h2 className="text-lg font-semibold text-left mb-2">Recipe Name *</h2>
          <input 
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter recipe name" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
            required
          />
        </div>

        {/* Description */}
        <div>
          <h2 className="text-lg font-semibold text-left mb-2">Description (Optional)</h2>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of your recipe" 
            rows="3"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical" 
          />
        </div>

        {/* Image URL */}
        <div>
          <h2 className="text-lg font-semibold text-left mb-2">Image URL (Optional)</h2>
          <input 
            type="url"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
          />
        </div>

        {/* Servings and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-left mb-2">Servings</h2>
            <input 
              type="number"
              name="servings"
              value={formData.servings}
              onChange={handleInputChange}
              placeholder="4" 
              min="1"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-left mb-2">Time (minutes)</h2>
            <input 
              type="number"
              name="totalTime"
              value={formData.totalTime}
              onChange={handleInputChange}
              placeholder="30" 
              min="1"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
            />
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="text-lg font-semibold text-left mb-2">Ingredients *</h2>
          <p className="text-sm text-gray-600 mb-2">Enter each ingredient on a new line</p>
          <textarea 
            name="ingredients"
            value={formData.ingredients}
            onChange={handleInputChange}
            placeholder="1 cup flour&#10;2 eggs&#10;1/2 cup sugar" 
            rows="6"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical" 
            required
          />
        </div>

        {/* Instructions */}
        <div>
          <h2 className="text-lg font-semibold text-left mb-2">Instructions</h2>
          <p className="text-sm text-gray-600 mb-2">Enter each step on a new line</p>
          <textarea 
            name="instructions"
            value={formData.instructions}
            onChange={handleInputChange}
            placeholder="Preheat oven to 350°F&#10;Mix dry ingredients&#10;Add wet ingredients" 
            rows="8"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical" 
          />
        </div>

        {/* Dietary Filters */}
        <div>
          <h2 className="text-lg font-semibold text-left mb-3">Dietary Labels</h2>
          <p className="text-sm text-gray-600 mb-3">Select all that apply to your recipe</p>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => toggleFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition
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
          {selectedFilters.length > 0 && (
            <p className="text-sm text-teal-600 mt-2">
              Selected: {selectedFilters.join(', ')}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding Recipe...' : 'Submit Recipe'}
        </button>
      </form>
    </div>
  );
}
