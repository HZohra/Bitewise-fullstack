// src/middleware/auth.js
import { verifyToken } from "../utils/auth.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // Expect: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyToken(token); // { userId, email }
    req.user = payload;                 // attach to request (req.user.userId, req.user.email)
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}
