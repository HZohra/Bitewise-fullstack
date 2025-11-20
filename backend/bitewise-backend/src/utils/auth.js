// src/utils/auth.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//security key for JWT signing and verification, should be changesd in production
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d"; // expires in 7days

// Hash a plain-text password
export async function hashPassword(plainPassword) {
  // 10 default
  return bcrypt.hash(plainPassword, 10);
}

// Compare a plain-text password with a stored hash
export async function comparePassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

// Create a JWT token for a user
export function createToken(user) {
  // Put only safe fields in the token payload
  const payload = {
    userId: user.id,
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Verify a JWT token and return the payload
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
