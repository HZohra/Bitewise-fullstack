import fetch from "node-fetch";

const OVERPASS_URL = process.env.OVERPASS_URL || "https://overpass-api.de/api/interpreter";
const DEFAULT_RADIUS = process.env.DEFAULT_RADIUS || 1000;

export async function findRestaurants(lat, lon, radius = DEFAULT_RADIUS) {
  const query = `
  [out:json];
  (
    node["amenity"="restaurant"](around:${radius},${lat},${lon});
    way["amenity"="restaurant"](around:${radius},${lat},${lon});
    relation["amenity"="restaurant"](around:${radius},${lat},${lon});
  );
  out center;
  `;

  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    body: query,
    headers: { "Content-Type": "text/plain" },
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.statusText}`);
  }

  const data = await response.json();

  const restaurants = data.elements.map((el) => {
    const tags = el.tags || {};
    const latRes = el.lat || (el.center && el.center.lat);
    const lonRes = el.lon || (el.center && el.center.lon);

    return {
      id: el.id,
      name: tags.name || "Unnamed restaurant",
      cuisine: tags.cuisine || null,
      lat: latRes,
      lon: lonRes,
    };
  });

  return restaurants;
}
