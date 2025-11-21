import React, { useState } from "react";

export default function Restaurants() {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);

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
    {
      id: 5,
      name: "PureVegan Deli",
      description: "100% vegan sandwiches, bowls, and smoothies.",
      dietTypes: ["Vegan"],
      // TODO: add coordinates when known
    },
    {
      id: 6,
      name: "SugarSmart Grill",
      description: "Delicious meals crafted with low-sugar sauces.",
      dietTypes: ["Low-Sugar"],
    },
    {
      id: 7,
      name: "Gluten-Free Pizza Co.",
      description: "Hand-tossed pizzas made with gluten-free dough.",
      dietTypes: ["Gluten-Free"],
    },
    {
      id: 8,
      name: "Harmony Veggie House",
      description: "Vegetarian comfort food with global flavors.",
      dietTypes: ["Vegetarian"],
    },
    {
      id: 9,
      name: "Veg & Go",
      description: "Fast-casual vegan meals for busy days.",
      dietTypes: ["Vegan", "Low-Sugar"],
    },
    {
      id: 10,
      name: "Balanced Bistro",
      description: "Modern American restaurant with low-sugar options.",
      dietTypes: ["Low-Sugar", "Vegetarian"],
    },
    {
      id: 11,
      name: "The Gluten-Free Spot",
      description: "All bakery items and entrees made gluten-free.",
      dietTypes: ["Gluten-Free"],
    },
    {
      id: 12,
      name: "Green Bowl Factory",
      description: "Customize your bowl with vegan and veggie bases.",
      dietTypes: ["Vegan", "Vegetarian"],
    },
  ];

  const filters = ["Low-Sugar", "Vegan", "Vegetarian", "Gluten-Free"];

  // Open directions in GOOGLE MAPS
  const openDirections = (restaurant) => {
    if (!restaurant.coordinates) {
      alert("No location coordinates available for this restaurant yet.");
      return;
    }

    const { lat, lng } = restaurant.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  // Get user's current location
  const handleUseMyLocation = () => {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        setLocationError("Unable to get your location. Please try again.");
      }
    );
  };

  // Haversine formula: distance between two lat/lng points in km
  const getDistanceKm = (loc1, loc2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius of the earth in km
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(loc1.lat)) *
        Math.cos(toRad(loc2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  // FILTER LOGIC

  // 1) Filter by diet type
  const dietFiltered =
    selectedFilter === ""
      ? restaurants
      : restaurants.filter((r) => r.dietTypes.includes(selectedFilter));

  // 2) Add distance + filter by radius if we have user location
  let filteredRestaurants;

  if (userLocation) {
    const withDistance = dietFiltered.map((r) => {
      if (!r.coordinates) {
        return { ...r, distanceKm: null };
      }

      const distance = getDistanceKm(userLocation, r.coordinates);

      return {
        ...r,
        distanceKm: distance,
      };
    });

    filteredRestaurants = withDistance
      .filter((r) => {
        if (r.distanceKm === null) {
          // Keep restaurants with unknown distance, or change to "return false" to hide them
          return true;
        }
        return r.distanceKm <= maxDistanceKm;
      })
      .sort((a, b) => {
        const aDist = a.distanceKm === null ? Number.POSITIVE_INFINITY : a.distanceKm;
        const bDist = b.distanceKm === null ? Number.POSITIVE_INFINITY : b.distanceKm;
        return aDist - bDist;
      });
  } else {
    filteredRestaurants = dietFiltered;
  }

  return (
    <div className="mt-20 px-6">
      <h1 className="text-center text-3xl font-bold text-teal-600">
        Restaurant Finder
      </h1>
      <p className="text-center text-gray-700 mt-2 mb-4">
        Find restaurants based on your dietary needs and location
      </p>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
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

      {/* Location Controls */}
      <div className="max-w-2xl mx-auto mb-8 flex flex-col gap-3 items-center">
        <button
          onClick={handleUseMyLocation}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
        >
          Use My Location
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Max distance:</label>
          <select
            value={maxDistanceKm}
            onChange={(e) => setMaxDistanceKm(Number(e.target.value))}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={15}>15 km</option>
            <option value={25}>25 km</option>
          </select>
        </div>

        {userLocation && (
          <p className="text-xs text-gray-500">
            Using your current location (lat: {userLocation.lat.toFixed(3)}, lng:{" "}
            {userLocation.lng.toFixed(3)})
          </p>
        )}

        {locationError && (
          <p className="text-sm text-red-500 text-center">{locationError}</p>
        )}
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
              {restaurant.address && (
                <p className="text-sm text-gray-500 mt-2">
                  {restaurant.address}
                </p>
              )}

              {/* Distance display */}
              {userLocation && restaurant.distanceKm !== undefined && restaurant.distanceKm !== null && (
                <p className="text-sm text-gray-700 mt-2">
                  ~{restaurant.distanceKm.toFixed(1)} km away
                </p>
              )}

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
                className="mt-4 w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!restaurant.coordinates}
              >
                <span>Get Directions</span>
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No restaurants match that dietary restriction and distance.
          </p>
        )}
      </div>
    </div>
  );
}
