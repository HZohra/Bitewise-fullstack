// Centralized API configuration
const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5002";

// Helper function to make authenticated requests
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");
  
  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.statusText}`);
  }

  return data;
};

export { API_BASE };
export default API_BASE;

