// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/"); // or "/recipes"
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to register");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Create Account</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-200"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-200"
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-200"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-600 underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
