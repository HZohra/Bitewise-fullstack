import { apiRequest } from "./config.js";

// Get user profile
export const getUserProfile = async () => {
  return apiRequest("/auth/me");
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  return apiRequest("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(profileData),
  });
};

// Update user preferences (diets, allergens, maxCookTime)
export const updateUserPreferences = async (preferences) => {
  return apiRequest("/auth/me/preferences", {
    method: "PATCH",
    body: JSON.stringify(preferences),
  });
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  return apiRequest("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
};

