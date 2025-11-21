import { useOutletContext } from "react-router-dom";

export default function AccountOverview() {
  const { user } = useOutletContext();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Account Overview</h1>
      <p className="text-gray-700 mb-4">
        Welcome to your BiteWise account. From here you can manage your recipes,
        allergies, and account settings.
      </p>

      {user && (
        <div className="bg-white rounded-2xl shadow p-4 space-y-2 max-w-md">
          <p>
            <span className="font-semibold">Name: </span>
            {user.name}
          </p>
          <p>
            <span className="font-semibold">Email: </span>
            {user.email}
          </p>
          {user.birthDate && (
            <p>
              <span className="font-semibold">Birth date: </span>
              {new Date(user.birthDate).toLocaleDateString()}
            </p>
          )}
          {user.phone && (
            <p>
              <span className="font-semibold">Phone: </span>
              {user.phone}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
