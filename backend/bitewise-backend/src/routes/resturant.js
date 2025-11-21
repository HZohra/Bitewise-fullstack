// src/routes/resturant.js
import express from "express";
import fetch from "node-fetch"; // npm install node-fetch

const router = express.Router();

// Simple test route
router.get("/", (req, res) => {
  res.json({ message: "Restaurant routes are working." });
});

// Geocode endpoint: /restaurants/geocode?address=...
router.get("/geocode", async (req, res) => {
  try {
    const address = req.query.address;
    if (!address) {
      return res
        .status(400)
        .json({ error: "Address query parameter is required." });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Missing Google Maps API key on server." });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (
      data.status !== "OK" ||
      !data.results ||
      data.results.length === 0
    ) {
      return res.status(404).json({ error: "Address not found." });
    }

    const location = data.results[0].geometry.location;

    return res.json({
      lat: location.lat,
      lng: location.lng,
    });
  } catch (err) {
    console.error("Geocode error:", err);
    res.status(500).json({ error: "Failed to geocode address." });
  }
});

export default router;
