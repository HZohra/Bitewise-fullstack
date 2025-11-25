// src/utils/overpass.js
// Using Node.js built-in fetch (available in Node 18+)

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/**
 * Hardcoded dietary filters for Waterloo region restaurants
 * Maps restaurant names to their dietary options
 */
const WATERLOO_RESTAURANT_FILTERS = {
  "Casa Rugantino": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "bb.q VILLAGE": {
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    halal: false,
  },
  "Freshii": {
    vegetarian: false,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Gladiator Burger": {
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    halal: false,
  },
  "Masala Bay": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Poke Box": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "LooBapBap": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Charminar House": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Chinese Lamian": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Foodie Fruitie": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Ken Sushi": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "MIGA": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Agha Turkish Cusine": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Famoso": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Proof Kitchen & Lounge": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Union Market": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Gyubee Japanese Grill": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Dosa Boyz": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "China Bowl": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Mozy's Shawarma": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Korner Kitchen": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Wing's Up": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "The Bauer Kitchen": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Coco Frutti": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Pür & Simple": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Daldongnae Korean BBQ": {
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    halal: false,
  },
  "Checkerboard Restaurant": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Raja Chettinad": {
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    halal: false,
  },
  "Thai Bistro": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Thai Sun": {
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    halal: false,
  },
  "The Jane Bond": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
  },
};

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
        const restaurantName = tags.name;
        const address = {
          houseNumber: tags["addr:housenumber"] || null,
          street: tags["addr:street"] || null,
          city: tags["addr:city"] || null,
          postcode: tags["addr:postcode"] || null,
        };

        const latVal = el.lat || el.center?.lat;
        const lngVal = el.lon || el.center?.lon;

        // Check if this restaurant has hardcoded filters
        const hardcodedFilters = WATERLOO_RESTAURANT_FILTERS[restaurantName];

        // Apply hardcoded filters if available, otherwise use OSM tags
        const dietaryOptions = hardcodedFilters || {
          vegetarian: tags.vegetarian === "yes",
          vegan: tags.vegan === "yes",
          glutenFree: tags["diet:gluten_free"] === "yes",
          halal: tags.halal === "yes",
        };

        return {
          id: el.id,
          name: restaurantName,
          cuisine: tags.cuisine || null,
          address,
          lat: latVal,
          lng: lngVal,
          ...dietaryOptions,
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