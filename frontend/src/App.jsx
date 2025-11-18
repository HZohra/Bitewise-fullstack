// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Restaurants from "./pages/Restaurants";
import AddRecipe from "./pages/AddRecipe";
import Chatbot from "./pages/Chatbot";
import RecipeDetails from "./pages/RecipeDetails";
import MyRecipes from "./pages/MyRecipes";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatbotWidget from "./components/ChatbotWidget.jsx";

function App() {
  const location = useLocation();

  // Routes where navbar + chatbot should be hidden
  const authRoutes = ["/login", "/register", "/forgot-password"];
  const hideNav = authRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-green-50 text-gray-900">
      {/* Show NavBar ONLY if not on auth pages */}
      {!hideNav && <NavBar />}

      {/* Page content */}
      <div className={hideNav ? "" : "p-6"}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddRecipe />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-recipes"
            element={
              <ProtectedRoute>
                <MyRecipes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Show Chatbot widget ONLY if not on auth pages */}
      {!hideNav && <ChatbotWidget />}
    </div>
  );
}

export default App;
