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

const router = express.Router();

/**
 * POST /auth/register
 * Body: { name, email, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: "Name, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long.",
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

    // 4. Create the user (stored via userService)
    const user = await createUser({
      name,
      email,
      passwordHash,
    });

    // 5. Create a JWT token
    const token = createToken(user);

    // 6. Send back safe user info + token
    return res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
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
 * PATCH /auth/me/preferences  (protected)
 * Body: { diets?, allergens?, maxCookTime? }
 */
router.patch("/me/preferences", requireAuth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { diets, allergens, maxCookTime } = req.body;

    const updatedUser = await updateUserPreferences(userId, {
      diets,
      allergens,
      maxCookTime,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
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

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "New password must be at least 8 characters long.",
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

export default router;
