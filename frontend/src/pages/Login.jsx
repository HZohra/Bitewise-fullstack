// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // Backend only needs email + password for now
      await login({ email: form.email, password: form.password });

      // If you want to actually use "remember", you can later
      // hook it into localStorage or cookies.

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to login");
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // For now, these just show an alert – no real OAuth hooked up.
  function handleGoogleLogin() {
    alert("Google sign-in is not implemented yet 🙂");
  }

  function handleFacebookLogin() {
    alert("Facebook sign-in is not implemented yet 🙂");
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-16">

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl px-8 py-10">
        {/* Header: title + register link */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-teal-600 font-semibold">
              Sign Up
            </Link>
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="loisbecket@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between text-sm mt-1">
            <label className="inline-flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-teal-600 hover:underline"
            >
              Forgot Password ?
            </button>
          </div>

          {/* Main login button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            Or
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Social login buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white border border-gray-200 text-xs">
              G
            </span>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-[#1877F2] text-white text-xs font-bold">
              f
            </span>
            <span>Continue with Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
}
