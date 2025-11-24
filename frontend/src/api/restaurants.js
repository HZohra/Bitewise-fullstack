import { apiRequest } from "./config.js";

// Search restaurants
export const searchRestaurants = async (query, location = null) => {
  const params = new URLSearchParams({ q: query });
  if (location) {
    params.append("location", location);
  }

  return apiRequest(`/restaurants?${params.toString()}`);
};

