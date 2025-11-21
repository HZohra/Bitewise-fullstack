// src/pages/Restaurants.jsx
import React, { useState } from "react";

const API_BASE_URL = "http://localhost:5000"; // or your env var later

export default function Restaurants() {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [userLocation, setUserLocation] = useState(null);      // from geolocation
  const [manualLocation, setManualLocation] = useState(null);  // from address geocoding
  const [showManualInput, setShowManualInput] = useState(false);

  // separate manual address fields
  const [manualStreet, setManualStreet] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualProvince, setManualProvince] = useState("");

  const [locationError, setLocationError] = useState("");
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // TEMPORARY MOCK DATA - we can replace this with API data later
  const restaurants = [
    {
      id: 1,
      name: "Fresh Garden Cafe",
      description: "Plant-forward café focusing on whole foods.",
      dietTypes: ["Vegan", "Vegetarian"],
      address: "123 Main St, Downtown Waterloo",
      coordinates: { lat: 43.4643, lng: -80.5204 },
    },
    {
      id: 2,
      name: "LiteBite Kitchen",
      description: "Great options for low-sugar meals and snacks.",
      dietTypes: ["Low-Sugar"],
      address: "456 King St N, Uptown Waterloo",
      coordinates: { lat: 43.4723, lng: -80.5449 },
    },
    {
      id: 3,
      name: "Celiac Safe Eats",
      description: "Dedicated gluten-free menu and kitchen.",
      dietTypes: ["Gluten-Free"],
      address: "789 University Ave E, Waterloo",
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
      address: "Downtown Kitchener",
      coordinates: { lat: 43.4519, lng: -80.493 },
    },
    {
      id: 6,
      name: "SugarSmart Grill",
      description: "Delicious meals crafted with low-sugar sauces.",
      dietTypes: ["Low-Sugar"],
      address: "Fairview Area, Kitchener",
      coordinates: { lat: 43.43, lng: -80.468 },
    },
    {
      id: 7,
      name: "Gluten-Free Pizza Co.",
      description: "Hand-tossed pizzas made with gluten-free dough.",
      dietTypes: ["Gluten-Free"],
      address: "Cambridge Centre Area",
      coordinates: { lat: 43.4, lng: -80.316 },
    },
    {
      id: 8,
      name: "Harmony Veggie House",
      description: "Vegetarian comfort food with global flavors.",
      dietTypes: ["Vegetarian"],
      address: "Preston, Cambridge",
      coordinates: { lat: 43.4005, lng: -80.354 },
    },
    {
      id: 9,
      name: "Veg & Go",
      description: "Fast-casual vegan meals for busy days.",
      dietTypes: ["Vegan", "Low-Sugar"],
      address: "North Waterloo",
      coordinates: { lat: 43.49, lng: -80.52 },
    },
    {
      id: 10,
      name: "Balanced Bistro",
      description: "Modern restaurant with low-sugar options.",
      dietTypes: ["Low-Sugar", "Vegetarian"],
      address: "Laurier / UW Area",
      coordinates: { lat: 43.472, lng: -80.541 },
    },
    {
      id: 11,
      name: "The Gluten-Free Spot",
      description: "All bakery items and entrees made gluten-free.",
      dietTypes: ["Gluten-Free"],
      address: "Downtown Waterloo",
      coordinates: { lat: 43.466, lng: -80.52 },
    },
    {
      id: 12,
      name: "Green Bowl Factory",
      description: "Customize your bowl with vegan and veggie bases.",
      dietTypes: ["Vegan", "Vegetarian"],
      address: "Kitchener-Waterloo Border",
      coordinates: { lat: 43.46, lng: -80.5 },
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

  // Use browser geolocation
  const handleUseMyLocation = () => {
    setLocationError("");
    setManualLocation(null);
    setShowManualInput(false);

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

  // Toggle manual input
  const toggleManualInput = () => {
    setShowManualInput((prev) => !prev);
    setLocationError("");
    setUserLocation(null); // if going manual, clear live location
  };

  // Geocode manual address via backend
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLocationError("");

    const street = manualStreet.trim();
    const city = manualCity.trim();
    const province = manualProvince.trim();

    if (!street || !city || !province) {
      setLocationError("Please fill in street address, city, and province.");
      setManualLocation(null);
      return;
    }

    const fullAddress = `${street}, ${city}, ${province}`;

    try {
      setIsGeocoding(true);

      const res = await fetch(
        `${API_BASE_URL}/restaurants/geocode?address=${encodeURIComponent(
          fullAddress
        )}`
      );

      if (!res.ok) {
        throw new Error("Geocoding failed");
      }

      const data = await res.json();

      if (!data.lat || !data.lng) {
        setLocationError("Could not find that address. Please double-check it.");
        setManualLocation(null);
        return;
      }

      setManualLocation({ lat: data.lat, lng: data.lng });
    } catch (err) {
      console.error(err);
      setLocationError("Error looking up that address. Please try again.");
      setManualLocation(null);
    } finally {
      setIsGeocoding(false);
    }
  };

  // Haversine: distance (km) between two lat/lng points
  const getDistanceKm = (loc1, loc2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371;
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(loc1.lat)) *
        Math.cos(toRad(loc2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Choose which location to use
  const effectiveLocation = userLocation
    ? userLocation
    : manualLocation
    ? manualLocation
    : null;

  // 1) Filter by diet type
  const dietFiltered =
    selectedFilter === ""
      ? restaurants
      : restaurants.filter((r) => r.dietTypes.includes(selectedFilter));

  // 2) Add distance + filter by radius if we have a location
  let filteredRestaurants;

  if (effectiveLocation) {
    const withDistance = dietFiltered.map((r) => {
      if (!r.coordinates) {
        return { ...r, distanceKm: null };
      }

      const distance = getDistanceKm(effectiveLocation, r.coordinates);
      return { ...r, distanceKm: distance };
    });

    filteredRestaurants = withDistance
      .filter((r) => {
        if (r.distanceKm === null) {
          // keep restaurants with unknown distance (optional)
          return true;
        }
        return r.distanceKm <= maxDistanceKm;
      })
      .sort((a, b) => {
        const aDist =
          a.distanceKm === null ? Number.POSITIVE_INFINITY : a.distanceKm;
        const bDist =
          b.distanceKm === null ? Number.POSITIVE_INFINITY : b.distanceKm;
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

      {/* Diet Filters */}
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
      <div className="max-w-3xl mx-auto mb-8 flex flex-col gap-4 items-center border border-teal-100 rounded-2xl p-4 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-3 w-full justify-center">
          {/* Button 1: Use My Location */}
          <button
            onClick={handleUseMyLocation}
            className="flex-1 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition text-center"
          >
            Use My Current Location
          </button>

          {/* Button 2: Enter Location Manually */}
          <button
            onClick={toggleManualInput}
            className="flex-1 px-4 py-2 rounded-lg bg-white text-teal-700 border border-teal-600 hover:bg-teal-50 transition text-center"
          >
            Enter Location Manually
          </button>
        </div>

        {/* Manual Input (shown only if toggled) */}
        {showManualInput && (
          <form
            onSubmit={handleManualSubmit}
            className="w-full flex flex-col gap-3"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={manualStreet}
                onChange={(e) => setManualStreet(e.target.value)}
                placeholder="Street & number (e.g., 75 University Ave W)"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                placeholder="City (e.g., Waterloo)"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <input
                type="text"
                value={manualProvince}
                onChange={(e) => setManualProvince(e.target.value)}
                placeholder="Province/State (e.g., ON)"
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGeocoding}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGeocoding ? "Locating..." : "Set Location"}
              </button>
            </div>
          </form>
        )}

        {/* Max Distance */}
        <div className="flex items-center gap-2 mt-2">
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

        {/* Info / Error */}
        {effectiveLocation && (
          <p className="text-xs text-gray-500 text-center">
            Using{" "}
            {userLocation
              ? "your current location"
              : "your manually entered address"}{" "}
            for distance calculations.
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
              className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white"
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
              {effectiveLocation &&
                restaurant.distanceKm !== undefined &&
                restaurant.distanceKm !== null && (
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
                Get Directions
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
