// src/utils/auth.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

/**
 * Hash a plain-text password.
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * Compare a plain-text password with a stored hash.
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * Create a JWT for a user.
 */
export function createToken(user) {
  const payload = {
    userId: user.id || user._id?.toString(),
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * Verify a JWT and return the decoded payload.
 * Throws if the token is invalid/expired.
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
