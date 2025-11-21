// src/components/NavBar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="relative bg-teal-500 text-white flex justify-between items-center px-8 py-3 shadow-md">
      {/* LEFT: Brand + main links */}
      <div className="flex items-center gap-8">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          BiteWise
        </Link>

        {/* Main links */}
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link to="/" className="hover:text-orange-300">
            Home
          </Link>
          <Link to="/recipes" className="hover:text-orange-300">
            Recipes
          </Link>
          <Link to="/restaurants" className="hover:text-orange-300">
            Restaurants
          </Link>
        </div>
      </div>

      {/* RIGHT: Auth / hamburger */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Hamburger icon for account menu */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-500 focus:ring-white"
            >
              <span className="sr-only">Open account menu</span>
              <div className="space-y-1">
                <span className="block w-5 h-0.5 bg-white rounded"></span>
                <span className="block w-5 h-0.5 bg-white rounded"></span>
                <span className="block w-5 h-0.5 bg-white rounded"></span>
              </div>
            </button>

            {/* Dropdown / slide menu */}
            {menuOpen && (
              <div className="absolute top-14 right-6 bg-white text-gray-800 rounded-xl shadow-lg w-64 py-3 z-50">
                {/* Signed in info */}
                <div className="px-4 pb-3 border-b">
                  <p className="text-xs font-semibold text-gray-500 uppercase">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium">
                    {user.name || "BiteWise user"}
                  </p>
                  {user.email && (
                    <p className="text-xs text-gray-400">{user.email}</p>
                  )}
                </div>

                {/* Account section */}
                <div className="mt-2">
                  <p className="px-4 mb-1 text-xs font-semibold text-gray-500 uppercase">
                    Account
                  </p>

                  <Link
                    to="/account"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Overview
                  </Link>

                  <Link
                    to="/account/allergies"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    My Allergies & Diet
                  </Link>

                  <Link
                    to="/account/my-recipes"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    My Recipes
                  </Link>

                  <Link
                    to="/account/add-recipe"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Add Recipe
                  </Link>
                </div>

                {/* Divider */}
                <div className="my-2 border-t" />

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1.5 rounded-full bg-white text-teal-600 text-sm font-semibold hover:bg-orange-300 hover:text-teal-900 transition"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
