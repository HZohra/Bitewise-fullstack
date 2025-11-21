import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function MyAllergies() {
  const { user, setUser } = useOutletContext();
  const [diets, setDiets] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [maxCookTime, setMaxCookTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // When user is loaded, pre-fill
  useEffect(() => {
    if (!user) return;
    setDiets(user.diets || []);
    setAllergens(user.allergens || []);
    setMaxCookTime(user.maxCookTime || "");
  }, [user]);

  const handleCommaListChange = (value, setter) => {
    const arr = value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    setter(arr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/auth/me/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          diets,
          allergens,
          maxCookTime: maxCookTime ? Number(maxCookTime) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setMessage(data.error || "Failed to save preferences.");
        setSaving(false);
        return;
      }

      const updatedUser = await res.json();
      setUser(updatedUser); // update in AccountLayout
      setMessage("Preferences saved!");
    } catch (err) {
      console.error("Error saving preferences", err);
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Allergies & Diet</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white rounded-2xl shadow p-4 max-w-xl"
      >
        <label className="block">
          <span className="block text-sm font-medium mb-1">
            Diet preferences (comma separated)
          </span>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g. vegetarian, halal, low-carb"
            value={diets.join(", ")}
            onChange={(e) => handleCommaListChange(e.target.value, setDiets)}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">
            Allergies (comma separated)
          </span>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g. peanuts, shellfish, gluten"
            value={allergens.join(", ")}
            onChange={(e) =>
              handleCommaListChange(e.target.value, setAllergens)
            }
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">
            Maximum cooking time (minutes)
          </span>
          <input
            type="number"
            min="0"
            className="w-full border rounded-lg px-3 py-2"
            value={maxCookTime}
            onChange={(e) => setMaxCookTime(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Preferences"}
        </button>

        {message && (
          <p className="text-sm mt-2 text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
