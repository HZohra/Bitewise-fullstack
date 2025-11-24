import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="text-center mt-20">
        <h1 className="text-3xl font-bold text-teal-600">Welcome to BiteWise!</h1>
        <p className="text-gray-700 mt-2 mb-12">Your personalized dietary companion</p>
      </div>

      {/* Key Features Section */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-teal-600 mb-6 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div 
            className="bg-white shadow-md rounded-2xl px-6 py-6 hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
            onClick={() => navigate('/recipes')}
          >
            <h3 className="text-lg font-semibold text-teal-600 mb-2">🍲 Find Recipes</h3>
            <p className="text-gray-600 text-sm">Search and filter recipes based on your dietary restrictions, allergies, and preferences under the 'Recipes' tab.</p>
          </div>
          <div 
            className="bg-white shadow-md rounded-2xl px-6 py-6 hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
            onClick={() => navigate('/chatbot')}
          >
            <h3 className="text-lg font-semibold text-teal-600 mb-2">🤖 AI Chatbot Assistant</h3>
            <p className="text-gray-600 text-sm">Get personalized meal ideas, recipe suggestions, and restaurant recommendations instantly using our AI assistant available throughout the app.</p>
          </div>
          <div 
            className="bg-white shadow-md rounded-2xl px-6 py-6 hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
            onClick={() => navigate('/restaurants')}
          >
            <h3 className="text-lg font-semibold text-teal-600 mb-2">📍 Nearby Restaurants</h3>
            <p className="text-gray-600 text-sm">Discover local restaurants that accommodate your dietary needs using integrated maps under the 'Restaurants' tab.</p>
          </div>
          <div 
            className="bg-white shadow-md rounded-2xl px-6 py-6 hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
            onClick={() => navigate('/add')}
          >
            <h3 className="text-lg font-semibold text-teal-600 mb-2">👩‍🍳 Share Your Recipes</h3>
            <p className="text-gray-600 text-sm">Create and share your own recipes with the community through your account settings.</p>
          </div>
          <div 
            className="bg-white shadow-md rounded-2xl px-6 py-6 hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-105"
            onClick={() => navigate('/favorites')}
          >
            <h3 className="text-lg font-semibold text-teal-600 mb-2">❤️ Save Your Favorites</h3>
            <p className="text-gray-600 text-sm">Bookmark recipes you love and access them anytime from your 'Favorites' collection.</p>
          </div>
        </div>
      </section>

      {/* Mission Statement Section */}
      <section
       id="mission"
      className="bg-gray-50 py-16 px-6 text-center mt-20"
    >
        <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold text-teal-600 mb-6">Our Mission</h2>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
      At <span className="font-semibold text-teal-600">BiteWise</span>, we believe everyone deserves
      access to safe, affordable, and culturally inclusive meals. Our platform bridges the gap
      between dietary needs and real-world food options; helping users make confident, informed
      choices every day.
    </p>
  </div>
</section>

      {/* Footer Section */}
      <footer>
        <p className="text-center text-gray-500 mt-10 mb-5">© 2025 BiteWise. All rights reserved.</p>
      </footer>

    </div>
  );
}
