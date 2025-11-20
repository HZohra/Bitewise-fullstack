// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, fetchMe } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("authToken") || null;
  });

  const [loading, setLoading] = useState(false);

  // If we have a token but no user yet, load /auth/me
  useEffect(() => {
    async function loadUser() {
      if (!token || user) return;
      try {
        setLoading(true);
        const me = await fetchMe(token);
        setUser(me);
        localStorage.setItem("authUser", JSON.stringify(me));
      } catch (err) {
        console.error("Failed to load user:", err);
        setUser(null);
        setToken(null);
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token, user]);

  async function register({ name, email, password }) {
    setLoading(true);
    try {
      const data = await registerUser({ name, email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  async function login({ email, password }) {
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("authToken", data.token);
      return data.user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
