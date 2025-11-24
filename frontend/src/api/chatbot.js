import { apiRequest } from "./config.js";

// Send message to chatbot
export const sendChatMessage = async (text, profile = {}) => {
  return apiRequest("/chat/ask", {
    method: "POST",
    body: JSON.stringify({
      text: text.trim(),
      profile: profile,
    }),
  });
};

// Get user profile for chatbot context
export const getUserProfile = async () => {
  try {
    return await apiRequest("/chat/me");
  } catch (error) {
    // If not authenticated, return empty profile
    return {
      user_id: "anonymous",
      profile: {
        diets: [],
        allergens: [],
        max_time: null,
        location: null,
      },
    };
  }
};

