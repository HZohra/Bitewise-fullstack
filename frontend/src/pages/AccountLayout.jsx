// src/pages/AccountLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AccountLayout() {
  const { user, setUser } = useAuth();
  const location = useLocation();

  // highlight active tab
  const current = location.pathname;

  return (
    <div className="flex gap-8 mt-6">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white shadow rounded-xl p-5 h-fit">
        <h2 className="text-lg font-bold mb-4">ACCOUNT</h2>

        <p className="text-sm text-gray-600 mb-4">Your account</p>
        <div className="border-b mb-4" />

        <nav className="flex flex-col gap-2">
          {/* HOME */}
          <Link
            to="/account/settings"
            className={`px-4 py-2 rounded-lg font-medium ${
              current.includes("/account/settings")
                ? "bg-green-100 text-green-800"
                : "hover:bg-gray-100"
            }`}
          >
            Personal Info
          </Link>

          {/* ALLERGIES */}
          <Link
            to="/account/allergies"
            className={`px-4 py-2 rounded-lg font-medium ${
              current.includes("/account/allergies")
                ? "bg-green-100 text-green-800"
                : "hover:bg-gray-100"
            }`}
          >
            My Allergies
          </Link>

          {/* DIETS */}
          <Link
            to="/account/diets"
            className={`px-4 py-2 rounded-lg font-medium ${
              current.includes("/account/diets")
                ? "bg-green-100 text-green-800"
                : "hover:bg-gray-100"
            }`}
          >
            My Diets
          </Link>
        </nav>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1">
        {/* Pass both user & setUser to children like MyAllergies / MyDiets */}
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}
