// src/components/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-teal-500 text-white flex justify-around items-center py-3 shadow-md">
      {/* Brand */}
      <Link to="/" className="text-lg font-bold">
        BiteWise
      </Link>

      {/* Links */}
      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-orange-300">
          Home
        </Link>
        <Link to="/recipes" className="hover:text-orange-300">
          Recipes
        </Link>
        <Link to="/restaurants" className="hover:text-orange-300">
          Restaurants
        </Link>
        <Link to="/add" className="hover:text-orange-300">
          Add Recipe
        </Link>
        <Link to="/chatbot" className="hover:text-orange-300">
          Chatbot
        </Link>

        {/* Auth-aware section */}
        {user ? (
          <>
            <Link to="/my-recipes" className="hover:text-orange-300">
              My Recipes
            </Link>

            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm"
            >
              Logout
            </button>

            <span className="text-sm text-orange-200 ml-1">
              Hi, {user.name?.split(" ")[0] || "there"}!
            </span>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="ml-4 px-3 py-1 rounded-md bg-white text-teal-600 text-sm font-medium hover:bg-orange-300 hover:text-teal-900"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1 rounded-md border border-white text-sm hover:bg-orange-300"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
