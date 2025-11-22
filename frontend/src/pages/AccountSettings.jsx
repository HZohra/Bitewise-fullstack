// src/pages/AccountSettings.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AccountSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal"); // "personal" | "allergies" | "diets"

  const initial = (user?.name || "B")[0].toUpperCase();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6">Home</h1>

      {/* Header with avatar + name + pills */}
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

        {/* Pills: personal info / allergies / diets */}
        <div className="flex flex-wrap gap-3">
          {/* stays local on this page */}
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

          {/* these go to the My Allergies & Diet page */}
          <Link
            to="/account/allergies"
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
          >
            Allergies
          </Link>

          <Link
            to="/account/allergies"
            className="px-4 py-2 rounded-xl text-sm font-medium border bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
          >
            Diets
          </Link>
        </div>
      </div>

      {/* CONTENT under the header, controlled by activeTab */}
      {activeTab === "personal" && (
        <section className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Personal info</h2>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="text-gray-500 text-xs uppercase">Name</p>
                <p className="font-medium">
                  {user?.name || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="text-gray-500 text-xs uppercase">Email</p>
                <p className="font-medium">
                  {user?.email || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="text-gray-500 text-xs uppercase">Phone</p>
                <p className="font-medium">
                  {user?.phone || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs uppercase">Birth date</p>
                <p className="font-medium">
                  {user?.birthDate
                    ? new Date(user.birthDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* The allergies & diets sections below can stay or be removed.
          They won't be used once you navigate away to /account/allergies,
          but it's fine to leave them for now if you want to reuse later. */}
    </div>
  );
}
