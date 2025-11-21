import { useState } from "react";

export default function AccountSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to change password.");
      } else {
        setMessage("Password changed successfully.");
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (err) {
      console.error("Error changing password", err);
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Account Info & Settings</h1>
      <p className="text-gray-700 mb-4">
        Here you can change your password. Later you can add options to edit
        your name, email, or delete your account.
      </p>

      <form
        onSubmit={handleChangePassword}
        className="space-y-4 bg-white rounded-2xl shadow p-4 max-w-md"
      >
        <label className="block">
          <span className="block text-sm font-medium mb-1">
            Current password
          </span>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium mb-1">
            New password
          </span>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold disabled:opacity-60"
        >
          {saving ? "Changing..." : "Change Password"}
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
