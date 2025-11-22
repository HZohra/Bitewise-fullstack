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
import ResetPassword from "./pages/ResetPassword.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatbotWidget from "./components/ChatbotWidget.jsx";

import AccountLayout from "./pages/AccountLayout.jsx";
import MyAllergies from "./pages/MyAllergies.jsx";
import AccountSettings from "./pages/AccountSettings.jsx";


function App() {
  const location = useLocation();

  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isResetPasswordRoute = location.pathname.startsWith("/reset-password");

  const hideNav =
    authRoutes.includes(location.pathname) || isResetPasswordRoute;

  return (
    <div className="min-h-screen bg-green-50 text-gray-900">
      {!hideNav && <NavBar />}

      <div className={hideNav ? "" : "p-6"}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Account: Home + Allergies */}
<Route
  path="/account"
  element={
    <ProtectedRoute>
      <AccountLayout />
    </ProtectedRoute>
  }
>
  {/* /account → “Home” page (AccountSettings) */}
  <Route index element={<AccountSettings />} />

  {/* also allow /account/settings to show the same page if you want */}
  <Route path="settings" element={<AccountSettings />} />

  {/* /account/allergies → Allergies page inside account */}
  <Route path="allergies" element={<MyAllergies />} />
</Route>


  {/* Standalone protected pages */}
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

      {!hideNav && <ChatbotWidget />}
    </div>
  );
}

export default App;
