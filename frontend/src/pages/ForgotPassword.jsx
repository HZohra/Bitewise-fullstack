// src/pages/ForgotPassword.jsx
import { useState } from "react";
// later you can import an API helper: requestPasswordResetApi

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // TODO: call your backend when it exists
      // await requestPasswordResetApi(email);

      setMessage(
        "If an account with this email exists, a reset link has been sent."
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Forgot Password</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-200"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
    </div>
  );
}
