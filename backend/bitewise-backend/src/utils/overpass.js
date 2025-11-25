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
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
    dairyFree: true,
    lowSugar: true,
    lowFat: true,
    eggFree: true,
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
  "Meet Fresh": {
    vegetarian: false,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "iPho": {
    vegetarian: false,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Vijay's Indian Cuisine": {
    vegetarian: false,
    vegan: true,
    glutenFree: false,
    halal: false,
  },
  "Empress of India": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Sole": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Yunshang Rice Noodle": {
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    halal: false,
  },
  "Copper Branch": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
  },
  "Graffiti Market": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Exclamation": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Bao Sandwich Bar": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
  },
  "Loloan Lobby Bar": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
  },
  "Fiddleheads Smoothie Bar": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Yang's Braised Chicken Rice": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Kabob Hut": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Asakusa": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Kabob Shack": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "momo": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Mel's Diner": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
  },
  "Canadian Istanbul": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Kentucky Bourbon and Barbecue": {
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    halal: false,
    highProtein: true,
  },
  "Crabby Joe's Bar and Grill": {
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    halal: false,
    highProtein: true,
  },
  "Swiss Chalet": {
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    halal: false,
    ketoFriendly: true,
    highProtein: true,
    dairyFree: true,
    eggFree: true,
  },
  "Sowon": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Fantastic Wok!": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Waterloo Star": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
    treeNutFree: true,
    shellfishFree: true,
    crustaceanFree: true,
    molluskFree: true,
    fishFree: true,
  },
  "Shinwa Asian Cuisine": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Nuri Village": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Yummy Chongqin": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
    lowSugar: true,
  },
  "Home Garden": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Morals Village": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
    treeNutFree: true,
    highProtein: true,
    eggFree: true,
    dairyFree: true,
  },
  "Kismet": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Northern Chinese Restaurant": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Yu Xiao Shan": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Aunty's Kitchen": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
    highProtein: true,
    lowSugar: true,
    eggFree: true,
    dairyFree: true,
  },
  "Rooster's Fried Chicken": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Mastis Resto Bar": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Tut's Egyptian Food": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
    highProtein: true,
    eggFree: true,
    dairyFree: true,
  },
  "Egg Club": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "The Sobo": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Royal Paan": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
    lowSugar: true,
    eggFree: true,
    dairyFree: true,
  },
  "Ye House": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Juicy Birds": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
    lowCarb: true,
    ketoFriendly: true,
  },
  "Rosel's": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Hyderabad Cafe": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Perfect Meat Bowl": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
    ketoFriendly: true,
    lowCarb: true,
  },
  "Myung-GA Korean Restaurant": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Pizza Hut": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "Mad Over Spices": {
    vegetarian: true,
    vegan: true,
    glutenFree: false,
    halal: false,
    eggFree: true,
    dairyFree: true,
  },
  "Pho Ahn Vu Waterloo": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Harper's Deli pop-up in Babylon Sisters": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Janet Lynn's Bistro": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Relish Shawarma": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
    ketoFriendly: true,
    lowCarb: true,
  },
  "Kinton Ramen": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Swine and Vine": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Elixir": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Eggholic": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "King Street Trio": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Potzone Hotpot": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
    ketoFriendly: true,
    lowCarb: true,
  },
  "Watami Sushi": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Jinzakaya": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Crystal Palace": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Champa Kitchen": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Owl of Minerva": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Wild Wing": {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
    ketoFriendly: true,
    lowCarb: true,
  },
  "Hanoi Viet Eatery": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
    lowSugar: true,
  },
  "Duke of Wellington": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
  },
  "Sweet & Savory Pie Company": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
  },
  "The Works": {
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    halal: false,
    highProtein: true,
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