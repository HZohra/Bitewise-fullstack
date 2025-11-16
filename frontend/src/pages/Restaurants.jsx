import React, { useState } from "react";

export default function Restaurants() {
  const [selectedFilter, setSelectedFilter] = useState("");

  // TEMPORARY MOCK DATA - we can replace this with API data later
  const restaurants = [
    {
      id: 1,
      name: "Fresh Garden Cafe",
      description: "Plant-forward café focusing on whole foods.",
      dietTypes: ["Vegan", "Vegetarian"],
      address: "123 Main St, Downtown",
      coordinates: { lat: 43.4643, lng: -80.5204 }, // Example: Waterloo coords
    },
    {
      id: 2,
      name: "LiteBite Kitchen",
      description: "Great options for low-sugar meals and snacks.",
      dietTypes: ["Low-Sugar"],
      address: "456 King St N, Uptown",
      coordinates: { lat: 43.4723, lng: -80.5449 },
    },
    {
      id: 3,
      name: "Celiac Safe Eats",
      description: "Dedicated gluten-free menu and kitchen.",
      dietTypes: ["Gluten-Free"],
      address: "789 University Ave E",
      coordinates: { lat: 43.4755, lng: -80.5268 },
    },
    {
      id: 4,
      name: "Vital Plates",
      description: "Healthy bowls and custom plates for any diet.",
      dietTypes: ["Vegetarian", "Low-Sugar"],
      address: "321 Weber St, Kitchener",
      coordinates: { lat: 43.4516, lng: -80.4925 },
    },
  ];

  // Open directions in GOOGLE MAPS
  const openDirections = (restaurant) => {
    const { lat, lng } = restaurant.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const filters = ["Low-Sugar", "Vegan", "Vegetarian", "Gluten-Free"];

  // FILTER LOGIC
  const filteredRestaurants =
    selectedFilter === ""
      ? restaurants
      : restaurants.filter((r) => r.dietTypes.includes(selectedFilter));

  return (
    <div className="mt-20 px-6">
      <h1 className="text-center text-3xl font-bold text-teal-600">
        Restaurant Finder
      </h1>
      <p className="text-center text-gray-700 mt-2 mb-8">
        Find restaurants based on your dietary needs
      </p>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-10 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() =>
              setSelectedFilter(selectedFilter === filter ? "" : filter)
            }
            className={`px-4 py-2 rounded-full border transition ${
              selectedFilter === filter
                ? "bg-teal-600 text-white border-teal-600"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Restaurant List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-teal-700">
                {restaurant.name}
              </h2>
              <p className="text-gray-600 mt-2">{restaurant.description}</p>
              <p className="text-sm text-gray-500 mt-2">📍 {restaurant.address}</p>

              <div className="flex flex-wrap gap-2 mt-4">
                {restaurant.dietTypes.map((diet) => (
                  <span
                    key={diet}
                    className="text-sm px-3 py-1 bg-teal-100 text-teal-700 rounded-full"
                  >
                    {diet}
                  </span>
                ))}
              </div>

              {/* Directions Button */}
              <button
                onClick={() => openDirections(restaurant)}
                className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
              >
                <span>🗺️</span>
                <span>Get Directions</span>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No restaurants match that dietary restriction.
          </p>
        )}
      </div>
    </div>
  );
}
