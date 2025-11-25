// src/components/NavBar.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/bitewise-logo.png";



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
    <nav className="relative bg-teal-500 text-white flex items-center px-6 py-3 shadow-md">
      {/* LEFT: Hamburger + Brand */}
      <div className="flex items-center gap-4">
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-500 focus:ring-white"
        >
          <span className="sr-only">Open menu</span>
          <div className="space-y-1">
            <span className="block w-6 h-0.5 bg-white rounded" />
            <span className="block w-6 h-0.5 bg-white rounded" />
            <span className="block w-6 h-0.5 bg-white rounded" />
          </div>
        </button>

        {/* Brand with logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wide">
          <img
            src={logo}
            alt="BiteWise Logo"
            className="w-8 h-8 object-contain bg-white rounded-full p-1"
          />
          <span>BiteWise</span>
        </Link>
      </div>

      {/* RIGHT: Nav Links */}
      <div className="flex items-center gap-6 text-sm font-medium ml-auto mr-16">
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

      {/* ======== SIDE DRAWER + OVERLAY ========= */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 bg-white text-gray-900 z-50 shadow-2xl flex flex-col">
            {/* Header / profile section */}
            <div className="px-5 pt-5 pb-4 border-b flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold text-lg">
                {user ? (user.name || "B")[0].toUpperCase() : "B"}
              </div>

              <div className="flex flex-col">
                {user ? (
                  <>
                    <span className="text-base font-semibold">
                      {user.name}
                    </span>
                    {user.email && (
                      <span className="text-xs text-gray-500">
                        {user.email}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/account");
                      }}
                      className="mt-1 text-sm font-semibold text-emerald-600 hover:underline text-left"
                    >
                      Manage account
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-base font-semibold">
                      Welcome to BiteWise
                    </span>
                    <span className="text-xs text-gray-500">
                      Sign in to manage your recipes
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* MAIN MENU ITEMS */}
            <div className="flex-1 overflow-y-auto py-3">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/add");
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-base font-medium hover:bg-gray-100"
                  >
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-lg">
                      +
                    </span>
                    <span>Add Recipe</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/my-recipes");
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-base font-medium hover:bg-gray-100"
                  >
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-lg">
                      🍽
                    </span>
                    <span>My Recipes</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/favorites");
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 text-base font-medium hover:bg-gray-100"
                  >
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-lg">
                      ❤️
                    </span>
                    <span>My Favorites</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                    className="w-11/12 mx-auto mt-3 mb-2 px-4 py-3 rounded-lg bg-emerald-500 text-white text-base font-semibold hover:bg-emerald-600 transition"
                  >
                    Sign in
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/register");
                    }}
                    className="w-11/12 mx-auto px-4 py-3 rounded-lg border border-emerald-500 text-emerald-600 text-base font-semibold hover:bg-emerald-50 transition"
                  >
                    Register
                  </button>
                </>
              )}
            </div>

            {/* FOOTER: Sign out row — Uber-style */}
            <div className="border-t px-1 py-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-3 text-base font-semibold text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              ) : (
                <p className="text-xs text-gray-500 px-4 pb-1">
                  Already have an account?{" "}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/login");
                    }}
                    className="text-emerald-600 font-semibold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
