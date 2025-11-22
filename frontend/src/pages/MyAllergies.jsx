// src/pages/MyAllergies.jsx
import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";

export default function MyAllergies() {
  const { user, setUser } = useOutletContext();
  const [allergies, setAllergies] = useState([""]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Pre-fill from user
  useEffect(() => {
    if (!user) return;
    if (user.allergens && user.allergens.length > 0) {
      setAllergies(user.allergens);
    } else {
      setAllergies([""]);
    }
  }, [user]);

  const handleAddField = () => {
    setAllergies((prev) => [...prev, ""]);
  };

  const handleChangeField = (index, value) => {
    setAllergies((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const handleRemoveField = (index) => {
    setAllergies((prev) => prev.filter((_, i) => i !== index));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setMessage("");

  // Clean out empties
  const cleanAllergies = allergies
    .map((a) => a.trim())
    .filter((a) => a.length > 0);

  try {
    // ✅ use the same key you use in Login / MyRecipes
    const token = localStorage.getItem("authToken");

    if (!token) {
      setMessage("You must be logged in.");
      setSaving(false);
      return;
    }

    const res = await fetch(
      "http://localhost:5002/auth/me/preferences",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ allergens: cleanAllergies }),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Save allergies failed:", data);
      setMessage(data.error || "Failed to save allergies.");
      setSaving(false);
      return;
    }

    const updatedUser = await res.json();
    if (setUser) {
      setUser(updatedUser);
    }
    setMessage("Allergies saved!");
  } catch (err) {
    console.error("Error saving allergies", err);
    setMessage("Something went wrong.");
  } finally {
    setSaving(false);
  }
};



  const initial = (user?.name || "B")[0].toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">My Allergies</h1>

      {/* Header card */}
      <div className="bg-white rounded-2xl shadow mb-6 px-8 py-6 flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-semibold">
            {initial}
          </div>
          <div>
            <p className="text-xl font-semibold">
              {user?.name || "BiteWise user"}
            </p>
            <p className="text-sm text-gray-600">{user?.email || "Not set"}</p>
          </div>
        </div>

        {/* Pills row: Personal info + Allergies */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/account/settings"
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
          >
            Personal info
          </Link>

          <button
            type="button"
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-gray-900 text-white border-gray-900"
          >
            Allergies
          </button>
        </div>
      </div>

      {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white rounded-2xl shadow p-6"
      >
        <div>
          <span className="block text-sm font-medium mb-1">Allergies</span>
          <p className="text-xs text-gray-500 mb-3">
            Add each food or ingredient you are allergic to. Click{" "}
            <span className="font-semibold">Add</span> to create more boxes.
          </p>

          <div className="space-y-3">
            {allergies.map((value, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                  placeholder="e.g. peanuts, pineapple, milk"
                  value={value}
                  onChange={(e) =>
                    handleChangeField(index, e.target.value)
                  }
                />
                {allergies.length > 1 && (
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
          {saving ? "Saving..." : "Save Allergies"}
        </button>

        {message && <p className="text-sm mt-2 text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
