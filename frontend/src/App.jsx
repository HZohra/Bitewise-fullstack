// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import ChatbotWidget from "./components/ChatbotWidget.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

//public pages
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Restaurants from "./pages/Restaurants";
import Chatbot from "./pages/Chatbot";

import AddRecipe from "./pages/AddRecipe";
import RecipeDetails from "./pages/RecipeDetails";
import MyRecipes from "./pages/MyRecipes";
import Favorite from "./pages/Favorite.jsx";

//Auth Routes
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

//Account pages
import AccountLayout from "./pages/AccountLayout.jsx";
import AccountSettings from "./pages/AccountSettings.jsx";
//import MyAllergies from "./pages/MyAllergies.jsx";
//import MyDiets from "./pages/MyDiets.jsx";   // 🌱 new

function App() {
  const location = useLocation();

  const authRoutes = ["/login", "/register", "/forgot-password"];
  const isResetPasswordRoute =
    location.pathname.startsWith("/reset-password");

  const hideNav =
    authRoutes.includes(location.pathname) || isResetPasswordRoute;

  return (
    <ChatProvider>
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
          <Route path="/favorites" element={<Favorite />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPassword />}
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Account: nested layout */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
    >
      {/* /account and /account/settings both show Personal Info */}
      <Route index element={<AccountSettings />} />
      <Route path="settings" element={<AccountSettings />} />
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
    </ChatProvider>
  );
}

export default App;
