// src/pages/AccountLayout.jsx
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
          <Link
            to="/account/settings"
            className={`px-4 py-2 rounded-lg font-medium ${
              current.includes("/account")
                ? "bg-green-100 text-green-800"
                : "hover:bg-gray-100"
            }`}
          >
            Personal Info
          </Link>
        </nav>
      </aside>

      {/* RIGHT CONTENT */}
      <main className="flex-1">
        {/* Pass user & setUser to children */}
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}
