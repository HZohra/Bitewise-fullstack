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
    <nav className="bg-teal-500 text-white flex justify-between items-center px-8 py-3 shadow-md">
      {/* LEFT SECTION: Brand + Links */}
      <div className="flex items-center gap-8">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          BiteWise
        </Link>

        {/* Links */}
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

          {user && (
            <Link to="/account" className="hover:text-orange-300">
              Account
            </Link>
          )}
        </div>
      </div>

      {/* RIGHT SECTION: Auth buttons */}
      <div className="flex items-center gap-4">
        {user ? (
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-md bg-emerald-400 hover:bg-emerald-500 text-white text-sm font-semibold shadow-sm transition"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1.5 rounded-md bg-white text-teal-600 text-sm font-semibold hover:bg-orange-300 hover:text-teal-900 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
