// src/routes/resturant.js
import express from "express";

const router = express.Router();

// Temporary route (so file is valid)
router.get("/", (req, res) => {
  res.json({ message: "Restaurant routes will be implemented soon." });
});

export default router;
