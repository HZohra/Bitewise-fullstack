// src/routes/auth.js

import express from "express";
import {
  hashPassword,
  comparePassword,
  createToken,
} from "../utils/auth.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserPreferences,
  updateUserPassword,
} from "../services/userService.js";
import { requireAuth } from "../middleware/auth.js";
import crypto from "crypto";
import { User } from "../models/userModel.js";

const router = express.Router();

/**
 * Helper: check password strength
 * Returns array of error messages (empty array means valid).
 */
function validatePasswordStrength(password) {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push("at least 8 characters");
  }
  if (!/\d/.test(password)) {
    errors.push("at least one number");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("at least one special character");
  }

  return errors;
}

/**
 * POST /auth/register
 * Body: { name, email, password, birthDate?, phone? }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, birthDate, phone } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required.",
      });
    }

    const pwErrors = validatePasswordStrength(password);
    if (pwErrors.length > 0) {
      return res.status(400).json({
        error:
          "Password must have " +
          pwErrors.join(", ") +
          ".",
      });
    }

    // 2. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    // 3. Hash the password
    const passwordHash = await hashPassword(password);

    // 4. Normalize birthDate if provided
    let parsedBirthDate = null;
    if (birthDate) {
      const d = new Date(birthDate);
      if (!isNaN(d.getTime())) {
        parsedBirthDate = d;
      }
    }

    // 5. Create the user (stored via userService)
    const user = await createUser({
      name,
      email,
      passwordHash,
      birthDate: parsedBirthDate,
      phone,
    });

    // 6. Create a JWT token
    const token = createToken(user);

    // 7. Send back safe user info + token
    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Error in POST /auth/register:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

/**
 * POST /auth/login
 * Body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    // 2. Find user by email
    const user = await findUserByEmail(email);
    if (!user) {
      // To avoid leaking which emails exist, use same error as wrong password
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // 3. Compare passwords
    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // 4. Create token
    const token = createToken(user);

    // 5. Return user + token
    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Error in POST /auth/login:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
});

/**
 * GET /auth/me  (protected)
 * Returns current logged-in user's profile
 */
router.get("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId; // from JWT token

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      birthDate: user.birthDate,
      phone: user.phone,
      diets: user.diets,
      allergens: user.allergens,
      maxCookTime: user.maxCookTime,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error in GET /auth/me:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * PATCH /auth/me  (protected)
 * Update basic profile fields: name, email, phone, birthDate
 */
router.patch("/me", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, phone, birthDate } = req.body;

    const update = {};

    if (typeof name === "string" && name.trim().length > 0) {
      update.name = name.trim();
    }

    if (typeof email === "string" && email.trim().length > 0) {
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await findUserByEmail(normalizedEmail);

      // If some *other* user already has this email, block it
      if (existing && existing.id.toString() !== userId.toString()) {
        return res
          .status(409)
          .json({ error: "Another account is already using that email." });
      }

      update.email = normalizedEmail;
    }

    if (phone !== undefined) {
      update.phone =
        typeof phone === "string" && phone.trim().length > 0
          ? phone.trim()
          : null;
    }

    if (birthDate !== undefined) {
      if (!birthDate) {
        update.birthDate = null;
      } else {
        const d = new Date(birthDate);
        update.birthDate = isNaN(d.getTime()) ? null : d;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      birthDate: updatedUser.birthDate,
      phone: updatedUser.phone,
      diets: updatedUser.diets,
      allergens: updatedUser.allergens,
      maxCookTime: updatedUser.maxCookTime,
      createdAt: updatedUser.createdAt,
    });
  } catch (error) {
    console.error("Error in PATCH /auth/me:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


/**
 * PATCH /auth/me/preferences  (protected)
 * Body: { diets?, allergens?, maxCookTime? }
 */
router.patch("/me/preferences", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    let { diets, allergens, maxCookTime } = req.body;

    const update = {};

    // diets: optional, must be array of trimmed strings if provided
    if (Array.isArray(diets)) {
      update.diets = diets
        .map((d) => String(d).trim())
        .filter((d) => d.length > 0);
    }

    // allergens: optional, must be array of trimmed strings if provided
    if (Array.isArray(allergens)) {
      update.allergens = allergens
        .map((a) => String(a).trim())
        .filter((a) => a.length > 0);
    }

    // maxCookTime: optional, can be null or number
    if (maxCookTime !== undefined) {
      if (maxCookTime === null || maxCookTime === "") {
        update.maxCookTime = null;
      } else {
        const n = Number(maxCookTime);
        update.maxCookTime = Number.isNaN(n) ? null : n;
      }
    }

    // If nothing to update, just return current user
    if (Object.keys(update).length === 0) {
      const currentUser = await findUserById(userId);
      if (!currentUser) {
        return res.status(404).json({ error: "User not found." });
      }
      return res.json({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        birthDate: currentUser.birthDate,
        phone: currentUser.phone,
        diets: currentUser.diets,
        allergens: currentUser.allergens,
        maxCookTime: currentUser.maxCookTime,
      });
    }

    // Apply updates
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      birthDate: updatedUser.birthDate,
      phone: updatedUser.phone,
      diets: updatedUser.diets,
      allergens: updatedUser.allergens,
      maxCookTime: updatedUser.maxCookTime,
    });
  } catch (error) {
    console.error("Error in PATCH /auth/me/preferences:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});


/**
 * POST /auth/change-password  (protected)
 * Body: { currentPassword, newPassword }
 */
router.post("/change-password", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Current password and new password are required.",
      });
    }

    const pwErrors = validatePasswordStrength(newPassword);
    if (pwErrors.length > 0) {
      return res.status(400).json({
        error:
          "New password must have " +
          pwErrors.join(", ") +
          ".",
      });
    }

    // 1. Load user
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 2. Check current password
    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Current password is incorrect." });
    }

    // 3. Hash new password and save
    const newHash = await hashPassword(newPassword);
    await updateUserPassword(userId, newHash);

    return res.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("Error in POST /auth/change-password:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * POST /auth/forgot-password
 * Body: { email }
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // For security, always respond 200
    if (!user) {
      return res.status(200).json({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendURL}/reset-password/${resetToken}`;

    // TODO: send resetUrl via email
    return res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
      resetUrl,
    });
  } catch (error) {
    console.error("Error in POST /auth/forgot-password:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * POST /auth/reset-password
 * Body: { token, newPassword }
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required." });
    }

    const pwErrors = validatePasswordStrength(newPassword);
    if (pwErrors.length > 0) {
      return res.status(400).json({
        error:
          "New password must have " +
          pwErrors.join(", ") +
          ".",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        error: "Token is invalid or has expired. Please request a new reset.",
      });
    }

    const newHash = await hashPassword(newPassword);
    user.passwordHash = newHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error in POST /auth/reset-password:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
