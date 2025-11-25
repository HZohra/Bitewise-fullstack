// src/pages/Restaurants.jsx
import { useState } from "react";
import { API_BASE } from "../api/config.js";

// Known area → coordinates
const AREA_COORDS = {
  waterloo: { lat: 43.4643, lng: -80.5204 },
  kitchener: { lat: 43.4516, lng: -80.4925 },
  cambridge: { lat: 43.3974, lng: -80.3114 },
};

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [useGeolocation, setUseGeolocation] = useState(false);
  const [geoLocation, setGeoLocation] = useState(null);

  const [selectedArea, setSelectedArea] = useState("");
  const [radiusKm, setRadiusKm] = useState(2);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Dietary filters matching backend dietary-mappings.json
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

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleResetFilters = () => {
    setSelectedFilters([]);
  };

  // Filter restaurants based on selected dietary filters
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (selectedFilters.length === 0) return true;

    // Map our filter names to restaurant properties
    const filterMap = {
      "Vegan": restaurant.vegan,
      "Vegetarian": restaurant.vegetarian,
      // For now, only Vegan and Vegetarian are supported by OpenStreetMap data
      // Other filters could be added if the data becomes available
    };

    // Restaurant must match at least one selected filter
    return selectedFilters.some(filter => filterMap[filter] === true);
  });

  // Get user location
  const handleUseCurrentLocation = () => {
    setError("");
    setUseGeolocation(true);
    setSelectedArea("");

    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Geolocation error:", err.code, err.message);
        setError(`Unable to get your location: ${err.message}`);
      }
    );
  };

  // Search backend for restaurants
  const handleSearch = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("🔍 Search button clicked");
    console.log("🔍 Current state:", { useGeolocation, geoLocation, selectedArea, radiusKm });
    
    setError("");
    setLoading(true);

    // Determine which coords to use
    let center = null;

    if (useGeolocation && geoLocation) {
      center = geoLocation;
      console.log("📍 Using geolocation:", center);
    } else if (selectedArea) {
      center = AREA_COORDS[selectedArea];
      console.log("📍 Using selected area:", selectedArea, center);
    }

    if (!center) {
      setLoading(false);
      setError("Please use your current location or choose an area.");
      console.log("❌ No location selected");
      return;
    }

    try {
      const radiusMeters = Number(radiusKm) * 1000;
      const url = `${API_BASE}/restaurants/nearby?lat=${center.lat}&lng=${center.lng}&radius=${radiusMeters}`;
      console.log("📡 Fetching from:", url);

      const res = await fetch(url);
      console.log("📡 Response status:", res.status);

      const data = await res.json();
      console.log("📡 Response data:", data);

      if (!res.ok) {
        setError(data.error || "Failed to fetch restaurants.");
        setRestaurants([]);
      } else {
        setRestaurants(data.restaurants || []);
        console.log("✅ Found", data.restaurants?.length || 0, "restaurants");
      }
    } catch (err) {
      console.error("❌ Error fetching restaurants:", err);
      setError("Something went wrong while fetching restaurants. Check console for details.");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-2">Find Restaurants Near You</h1>
      <p className="text-gray-700 mb-4">
        Use your current location or choose a nearby area to discover
        restaurants from OpenStreetMap.
      </p>

      {/* LOCATION CONTROLS */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          
          {/* Use current location */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Use my current location
            </label>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
                useGeolocation
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "bg-white text-emerald-600 border-emerald-400 hover:bg-emerald-50"
              }`}
            >
              Use current location
            </button>

            {geoLocation && (
              <span className="mt-1 text-xs text-gray-500">
                ({geoLocation.lat.toFixed(4)}, {geoLocation.lng.toFixed(4)})
              </span>
            )}
          </div>

          {/* Area picker */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Or choose an area</label>
            <select
              className="border rounded-lg px-3 py-2 text-sm"
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setUseGeolocation(false);
              }}
            >
              <option value="">-- Select area --</option>
              <option value="waterloo">Waterloo</option>
              <option value="kitchener">Kitchener</option>
              <option value="cambridge">Cambridge</option>
            </select>

            {selectedArea && (
              <span className="mt-1 text-xs text-gray-500">
                Center: {AREA_COORDS[selectedArea].lat},{" "}
                {AREA_COORDS[selectedArea].lng}
              </span>
            )}
          </div>

          {/* Radius */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Radius (km)</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              className="border rounded-lg px-3 py-2 w-24 text-sm"
              value={radiusKm}
              onChange={(e) => setRadiusKm(e.target.value)}
            />
          </div>

          {/* Search button */}
          <div className="flex flex-col">
            <span className="text-sm font-medium mb-1 invisible">.</span>
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* Reset Filters button */}
          <div className="flex flex-col">
            <span className="text-sm font-medium mb-1 invisible">.</span>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium whitespace-nowrap"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mt-3 max-h-32 overflow-y-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => toggleFilter(filter)}
              className={`px-3 py-1 rounded-full text-sm font-medium border transition
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

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>      {/* RESULTS */}
      <div className="space-y-3">
        {loading && <p>Loading restaurants...</p>}

        {!loading && restaurants.length === 0 && !error && (
          <p className="text-sm text-gray-600">
            No restaurants loaded yet. Choose a location and click{" "}
            <span className="font-semibold">Search</span>.
          </p>
        )}

        {!loading && restaurants.length > 0 && filteredRestaurants.length === 0 && (
          <p className="text-sm text-gray-600">
            No restaurants match the selected filters. Try adjusting your filters.
          </p>
        )}

        {!loading &&
          filteredRestaurants.map((r) => {
            const line1 =
              r.address.houseNumber && r.address.street
                ? `${r.address.houseNumber} ${r.address.street}`
                : r.address.street || null;

            const line2 = [r.address.city, r.address.postcode]
              .filter(Boolean)
              .join(" ");            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl shadow px-4 py-3 flex flex-col gap-1"
              >
                <div className="font-semibold text-lg">{r.name}</div>

                {r.cuisine && (
                  <div className="text-sm text-gray-700">
                    Cuisine: {r.cuisine}
                  </div>
                )}

                {(line1 || line2) && (
                  <div className="text-sm text-gray-600">
                    {line1}
                    {line1 && line2 ? ", " : ""}
                    {line2}
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Coordinates: {r.lat?.toFixed(5)}, {r.lng?.toFixed(5)}
                </div>

                {(r.vegan || r.vegetarian || r.halal) && (
                  <div className="text-xs text-emerald-700 mt-1">
                    {r.vegan && "Vegan · "}
                    {r.vegetarian && "Vegetarian · "}
                    {r.halal && "Halal"}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}