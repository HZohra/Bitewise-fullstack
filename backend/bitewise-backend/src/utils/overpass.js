// src/utils/overpass.js
import fetch from "node-fetch";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/**
 * Query Overpass for restaurants near a given lat/lng within radius (meters)
 */
export async function fetchNearbyRestaurants(lat, lng, radiusMeters = 2000) {
  // Overpass QL query:
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      way["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      relation["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
    );
    out center;
  `;

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: query }).toString(),
  });

  if (!res.ok) {
    throw new Error(`Overpass error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  // Normalize Overpass elements into a simpler restaurant object
  const restaurants = data.elements
    .filter((el) => el.tags && el.tags.name)
    .map((el) => {
      const tags = el.tags || {};
      const address = {
        houseNumber: tags["addr:housenumber"] || null,
        street: tags["addr:street"] || null,
        city: tags["addr:city"] || null,
        postcode: tags["addr:postcode"] || null,
      };

      const latVal = el.lat || el.center?.lat;
      const lngVal = el.lon || el.center?.lon;

      return {
        id: el.id,
        name: tags.name,
        cuisine: tags.cuisine || null,
        address,
        lat: latVal,
        lng: lngVal,
        vegetarian: tags.vegetarian === "yes",
        vegan: tags.vegan === "yes",
        halal: tags.halal === "yes",
        tags, // keep all original tags in case you want more later
      };
    });

  return restaurants;
}