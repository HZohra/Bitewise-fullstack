// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    birthDate: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [submitError, setSubmitError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  // ---------- Password validation ----------
  function validatePassword(pw) {
    const errors = [];

    if (pw.length < 8) {
      errors.push("At least 8 characters");
    }
    if (!/[0-9]/.test(pw)) {
      errors.push("At least one number");
    }
    if (!/[^A-Za-z0-9]/.test(pw)) {
      errors.push("At least one special character");
    }

    return errors;
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    // Validate password on submit
    const pwErrors = validatePassword(form.password);
    if (pwErrors.length > 0) {
      setPasswordErrors(pwErrors);
      setPasswordTouched(true);
      setSubmitError("Password does not meet the requirements.");
      return;
    }

    // Confirm password match
    if (form.password !== form.confirmPassword) {
      setConfirmTouched(true);
      setSubmitError("Passwords do not match.");
      return;
    }

    try {
      // For now, only send the fields your backend expects
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Failed to register");
    }
  }

  const passwordIsValid =
    passwordErrors.length === 0 && form.password.length > 0;

  const passwordsMatch =
    form.confirmPassword.length > 0 &&
    form.confirmPassword === form.password;

  return (
    <div className="min-h-[calc(100vh-88px)] flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl px-8 py-10">
        {/* Header row */}
        <div className="flex items-baseline justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Sign up</h1>
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-teal-600 font-semibold">
              Login
            </Link>
          </p>
        </div>

        {submitError && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {submitError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Lois Becket"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

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

          {/* Birth Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Birth of date
            </label>
            <input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Phone with flags */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <PhoneInput
              country="ca" // default Canada; change if you want
              value={form.phone}
              onChange={(value) =>
                setForm((prev) => ({ ...prev, phone: value }))
              }
              // Tailwind-like styling overrides
              inputClass="!w-full !h-12 !text-sm !border !border-gray-200 !rounded-xl !pl-12 !focus:outline-none !focus:ring-2 !focus:ring-teal-500"
              buttonClass="!border !border-gray-200 !rounded-l-xl"
              containerClass="!w-full"
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
              placeholder="Min 8 characters, number & special char"
              value={form.password}
              onChange={handleChange}
              onBlur={() => setPasswordTouched(true)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            {/* Password requirements list */}
            <ul className="mt-1 text-xs">
              <li
                className={
                  passwordTouched && form.password.length < 8
                    ? "text-red-500"
                    : "text-gray-500"
                }
              >
                • At least 8 characters
              </li>
              <li
                className={
                  passwordTouched && !/[0-9]/.test(form.password)
                    ? "text-red-500"
                    : "text-gray-500"
                }
              >
                • At least one number
              </li>
              <li
                className={
                  passwordTouched && !/[^A-Za-z0-9]/.test(form.password)
                    ? "text-red-500"
                    : "text-gray-500"
                }
              >
                • At least one special character
              </li>
            </ul>

            {passwordTouched && passwordIsValid && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Password meets all requirements.
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={() => setConfirmTouched(true)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {confirmTouched &&
              form.confirmPassword.length > 0 &&
              !passwordsMatch && (
                <p className="text-xs text-red-500 mt-1">
                  Passwords do not match.
                </p>
              )}
            {confirmTouched && passwordsMatch && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Passwords match.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
