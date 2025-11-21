// src/pages/AccountLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AccountLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to load user info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 bg-white rounded-2xl shadow p-5 h-fit">
        <div className="mb-6 border-b pb-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Account
          </p>
          <h2 className="text-xl font-semibold">
            {loading ? "Loading..." : user?.name || "Your account"}
          </h2>
          <p className="text-sm text-gray-500">{user?.email}</p>

          {/* Quick summary of preferences if available */}
          {user && (
            <div className="mt-3 text-xs text-gray-600 space-y-1">
              {user.diets?.length > 0 && (
                <p>
                  <span className="font-semibold">Diets:</span>{" "}
                  {user.diets.join(", ")}
                </p>
              )}
              {user.allergens?.length > 0 && (
                <p>
                  <span className="font-semibold">Allergens:</span>{" "}
                  {user.allergens.join(", ")}
                </p>
              )}
              {user.maxCookTime && (
                <p>
                  <span className="font-semibold">Max cook time:</span>{" "}
                  {user.maxCookTime} min
                </p>
              )}
            </div>
          )}
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink
            end
            to="/account"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-green-100 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            Overview
          </NavLink>

          <NavLink
            to="/account/add-recipe"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-green-100 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            Add Recipe
          </NavLink>

          <NavLink
            to="/account/my-recipes"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-green-100 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            My Recipes
          </NavLink>

          <NavLink
            to="/account/allergies"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-green-100 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            My Allergies & Diet
          </NavLink>

          <NavLink
            to="/account/settings"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm ${
                isActive ? "bg-green-100 font-semibold" : "hover:bg-gray-100"
              }`
            }
          >
            Account Info & Settings
          </NavLink>
        </nav>
      </aside>

      {/* Nested pages */}
      <main className="flex-1">
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}
