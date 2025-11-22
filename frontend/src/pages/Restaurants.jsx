// src/pages/Restaurants.jsx
import { useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  const [geoLocation, setGeoLocation] = useState(null); // { lat, lng }

  const [selectedArea, setSelectedArea] = useState(""); // "waterloo", etc.
  const [radiusKm, setRadiusKm] = useState(2); // default 2km

  // Get browser location
  const handleUseCurrentLocation = () => {
    setError("");
    setUseGeolocation(true);
    setSelectedArea("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
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
        console.error("Geolocation error:", err);
        setError("Unable to get your location.");
      }
    );
  };

  // Search using Overpass via backend
  const handleSearch = async () => {
    setError("");
    setLoading(true);

    // Decide which coordinates to use
    let center = null;

    if (useGeolocation && geoLocation) {
      center = geoLocation;
    } else if (selectedArea) {
      center = AREA_COORDS[selectedArea];
    }

    if (!center) {
      setLoading(false);
      setError("Please use your current location or choose an area.");
      return;
    }

    try {
      const radiusMeters = Number(radiusKm) * 1000;

      const res = await fetch(
        `${API_BASE_URL}/restaurants/nearby?lat=${center.lat}&lng=${center.lng}&radius=${radiusMeters}`
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch restaurants.");
        setRestaurants([]);
      } else {
        setRestaurants(data.restaurants || []);
      }
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Something went wrong while fetching restaurants.");
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-2">Find Restaurants Near You</h1>
      <p className="text-gray-700 mb-4">
        Use your current location or choose a nearby area to discover
        restaurants from OpenStreetMap.
      </p>

      {/* LOCATION CONTROLS */}
      <div className="bg-white rounded-2xl shadow p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Use my current location */}
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

          {/* OR choose an area */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Or choose an area
            </label>
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
            <span className="text-sm font-medium mb-1 invisible">
              Button
            </span>
            <button
              onClick={handleSearch}
              className="px-5 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600"
            >
              Search
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 mt-2">
            {error}
          </p>
        )}
      </div>

      {/* RESULTS */}
      <div className="space-y-3">
        {loading && <p>Loading restaurants...</p>}

        {!loading && restaurants.length === 0 && !error && (
          <p className="text-sm text-gray-600">
            No restaurants loaded yet. Choose a location and click{" "}
            <span className="font-semibold">Search</span>.
          </p>
        )}

        {!loading &&
          restaurants.map((r) => {
            const line1 =
              r.address.houseNumber && r.address.street
                ? `${r.address.houseNumber} ${r.address.street}`
                : r.address.street || null;
            const line2 = [r.address.city, r.address.postcode]
              .filter(Boolean)
              .join(" ");

            return (
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