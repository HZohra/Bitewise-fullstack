// src/pages/AccountOverview.jsx
import { useAuth } from "../context/AuthContext";

export default function AccountOverview() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Account Overview</h1>
      <p className="text-gray-600 mb-6">
        Hi {user?.name || "there"}, here’s a quick summary of your BiteWise
        account and preferences.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">
            Profile
          </h2>
          <p className="text-sm">
            <span className="font-medium">Name:</span> {user?.name || "—"}
          </p>
          <p className="text-sm">
            <span className="font-medium">Email:</span> {user?.email || "—"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">
            Quick actions
          </h2>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li>Update your allergies & diet in settings.</li>
            <li>Browse recipes tailored to your preferences.</li>
            <li>Save your favourite meals to revisit later.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
