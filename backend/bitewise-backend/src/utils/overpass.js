// src/utils/overpass.js
// Using Node.js built-in fetch (available in Node 18+)

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/**
 * Query Overpass for restaurants near a given lat/lng within radius (meters)
 */
export async function fetchNearbyRestaurants(lat, lng, radiusMeters = 2000) {
  // Overpass QL query
  const query = [
    '[out:json][timeout:25];',
    '(',
    `node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});`,
    `way["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});`,
    `relation["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});`,
    ');',
    'out center;'
  ].join('').trim();

  // Add timeout to prevent hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const res = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: query,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Overpass API error:', res.status, res.statusText, errorText);
      throw new Error(`Overpass error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // Check if we have elements
    if (!data.elements || !Array.isArray(data.elements)) {
      console.warn('Overpass API returned no elements:', data);
      return [];
    }

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
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('Overpass API request timed out after 30 seconds');
      throw new Error('Request to Overpass API timed out. Please try again with a smaller radius.');
    }
    throw error;
  }
}