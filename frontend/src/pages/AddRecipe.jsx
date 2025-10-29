import React from 'react';

export default function AddRecipe() {
  return (
    <div className="mt-20 max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-teal-600 text-center mb-8"> Add Your Recipe</h1>
      
      <form className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-left mb-2">Recipe Name</h2>
          <input 
            type="text" 
            placeholder="Enter recipe name" 
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-left mb-2">Ingredients</h2>
          <textarea 
            placeholder="List your ingredients (e.g., 1 cup flour, 2 eggs, etc.)" 
            rows="6"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical" 
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-left mb-2">Instructions</h2>
          <textarea 
            placeholder="Step-by-step cooking instructions" 
            rows="8"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical" 
          />
        </div>

        <button className="w-full bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition-colors font-semibold">
          Submit Recipe
        </button>
      </form>
    </div>
  );
}
