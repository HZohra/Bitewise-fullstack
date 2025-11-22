// src/pages/MyDiets.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MyDiets() {
  const { user, setUser } = useAuth();

  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5002/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to load profile");
          setLoading(false);
          return;
        }

        const data = await res.json();
        if (setUser) setUser(data);

        const serverDiets =
          Array.isArray(data.diets) && data.diets.length > 0
            ? data.diets
            : [];
        setDiets(serverDiets);
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser]);

  const cleanDiets = diets
    .map((d) => String(d).trim())
    .filter((d) => d.length > 0);

  const handleAddField = () => {
    setDiets((prev) => [...prev, ""]);
  };

  const handleChangeField = (index, value) => {
    setDiets((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const handleRemoveField = (index) => {
    setDiets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setMessage("You must be logged in.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5002/auth/me/preferences",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ diets: cleanDiets }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Save diets failed:", data);
        setMessage(data.error || "Failed to save diets.");
        setSaving(false);
        return;
      }

      const updatedUser = await res.json();
      if (setUser) setUser(updatedUser);
      setDiets(
        Array.isArray(updatedUser.diets) ? updatedUser.diets : []
      );
      setMessage("Diets saved!");
    } catch (err) {
      console.error("Error saving diets", err);
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const initial = (user?.name || "B")[0].toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Diets</h1>

      <div className="bg-white rounded-2xl shadow mb-6 px-8 py-6 flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-semibold">
            {initial}
          </div>
          <div>
            <p className="text-xl font-semibold">
              {user?.name || "BiteWise user"}
            </p>
            <p className="text-sm text-gray-600">
              {user?.email || "Not set"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/account/settings"
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
          >
            Personal info
          </Link>

          <Link
            to="/account/allergies"
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
          >
            Allergies
          </Link>

          <button
            type="button"
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-gray-900 text-white border-gray-900"
          >
            Diets
          </button>
        </div>
      </div>

      {/* CURRENT DIETS */}
      <section className="bg-white rounded-2xl shadow mb-6 p-6">
        <h2 className="text-lg font-semibold mb-2">
          Your Current Diets
        </h2>
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : cleanDiets.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven't added any diet preferences yet.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2 mt-2">
            {cleanDiets.map((d) => (
              <li
                key={d}
                className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100"
              >
                {d}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-2xl shadow p-6"
      >
        <div>
          <span className="block text-sm font-medium mb-1">
            Edit Diets
          </span>
          <p className="text-xs text-gray-500 mb-3">
            Add or remove diet preferences below (e.g. vegetarian,
            vegan, halal, gluten-free).
          </p>

          <div className="space-y-3">
            {diets.map((value, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. vegetarian, vegan, halal"
                  value={value}
                  onChange={(e) =>
                    handleChangeField(index, e.target.value)
                  }
                />
                {diets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddField}
              className="mt-1 px-4 py-2 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-semibold hover:bg-emerald-200"
            >
              Add
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Diets"}
        </button>

        {message && (
          <p className="text-sm mt-2 text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
