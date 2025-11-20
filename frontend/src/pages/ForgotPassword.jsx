// src/pages/ForgotPassword.jsx
import { useState } from "react";

const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5002";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [wasSubmitted, setWasSubmitted] = useState(false);

  async function sendReset() {
    if (!email) {
      setError("Please enter your email first.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      // Backend always returns a generic message + resetUrl for debugging
      setMessage(
        data.message ||
          "If an account with this email exists, a reset link has been sent."
      );
      setWasSubmitted(true);

      if (data.resetUrl) {
        // For now you can click this in the console to test the flow
        console.log("Password reset URL:", data.resetUrl);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setWasSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await sendReset();
  }

  async function handleResend() {
    await sendReset();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 py-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl px-8 py-10 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">
          Forgot Password
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
        {message && (
          <p className="text-green-600 text-sm text-center">{message}</p>
        )}

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>

        {wasSubmitted && (
          <p className="text-xs text-center text-gray-500 mt-2">
            Didn&apos;t receive the email?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={loading}
              className="text-teal-600 font-medium underline disabled:opacity-60"
            >
              Resend link
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
