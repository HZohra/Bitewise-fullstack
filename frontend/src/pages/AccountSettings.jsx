// src/pages/AccountSettings.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5002";

function formatDateInput(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AccountSettings() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("personal"); // still used for top pills

  // -------- PERSONAL INFO FORM STATE --------
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  // -------- PASSWORD FORM STATE --------
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  // When user from context changes, pre-fill the form
  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      birthDate: formatDateInput(user.birthDate),
    });
  }, [user]);

  const initial = (user?.name || "B")[0].toUpperCase();

  // ---------- HANDLERS ----------

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setProfileMessage("You must be logged in.");
      setSavingProfile(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setProfileMessage(data.error || "Failed to update profile.");
        setSavingProfile(false);
        return;
      }

      // data is the updated user
      if (setUser) {
        setUser(data);
      }
      setProfileMessage("Profile updated!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileMessage("Something went wrong.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirmation do not match.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setPasswordMessage("You must be logged in.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setPasswordMessage(data.error || "Failed to change password.");
        setSavingPassword(false);
        return;
      }

      setPasswordMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordMessage("Something went wrong.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">Personal Info</h1>

      {/* Header card with avatar + pills */}
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

        {/* Pills row */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
              activeTab === "personal"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Personal info
          </button>

          <Link
            to="/account/allergies"
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
          >
            Allergies
          </Link>

          <Link
            to="/account/diets"
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
          >
            Diets
          </Link>
        </div>
      </div>

      {/* PERSONAL INFO CARD */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-6 mb-6">
        <h2 className="text-lg font-semibold">Edit personal info</h2>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-sm">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs font-semibold uppercase">
              Name
            </label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2"
              value={profile.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs font-semibold uppercase">
              Email
            </label>
            <input
              type="email"
              className="border rounded-lg px-3 py-2"
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs font-semibold uppercase">
              Phone
            </label>
            <input
              type="tel"
              className="border rounded-lg px-3 py-2"
              placeholder="e.g. 519-555-1234"
              value={profile.phone}
              onChange={(e) => handleProfileChange("phone", e.target.value)}
            />
          </div>

          {/* Birth date */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs font-semibold uppercase">
              Birth date
            </label>
            <input
              type="date"
              className="border rounded-lg px-3 py-2"
              value={profile.birthDate}
              onChange={(e) =>
                handleProfileChange("birthDate", e.target.value)
              }
            />
          </div>

          <button
            type="submit"
            disabled={savingProfile}
            className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold disabled:opacity-60"
          >
            {savingProfile ? "Saving..." : "Save changes"}
          </button>

          {profileMessage && (
            <p className="text-sm mt-2 text-gray-700">{profileMessage}</p>
          )}
        </form>
      </section>

      {/* CHANGE PASSWORD CARD */}
      <section className="bg-white rounded-2xl shadow p-6 space-y-6">
        <h2 className="text-lg font-semibold">Change password</h2>
        <p className="text-xs text-gray-500">
          Enter your current password and choose a new one with at least 8
          characters, one number, and one special character.
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4 text-sm">
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs font-semibold uppercase">
              Current password
            </label>
            <input
              type="password"
              className="border rounded-lg px-3 py-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs font-semibold uppercase">
              New password
            </label>
            <input
              type="password"
              className="border rounded-lg px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs font-semibold uppercase">
              Confirm new password
            </label>
            <input
              type="password"
              className="border rounded-lg px-3 py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold disabled:opacity-60"
          >
            {savingPassword ? "Saving..." : "Change password"}
          </button>

          {passwordMessage && (
            <p className="text-sm mt-2 text-gray-700">{passwordMessage}</p>
          )}
        </form>
      </section>
    </div>
  );
}
