// src/routes/resturant.js
import express from "express";
import { fetchNearbyRestaurants } from "../utils/overpass.js";

const router = express.Router();

/**
 * GET /restaurants/nearby
 * Query params:
 *   - lat: latitude (required)
 *   - lng: longitude (required)
 *   - radius: radius in meters (optional, default 2000)
 *
 * Example:
 *   /restaurants/nearby?lat=43.4643&lng=-80.5204&radius=2000
 */
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "lat and lng query parameters are required." });
    }

    const radiusMeters = radius ? Number(radius) : 2000;

    const restaurants = await fetchNearbyRestaurants(
      Number(lat),
      Number(lng),
      radiusMeters
    );

    return res.json({ restaurants });
  } catch (err) {
    console.error("Error in GET /restaurants/nearby:", err);
    return res.status(500).json({ error: "Failed to fetch restaurants." });
  }
});

/**
 * If you had older endpoints (e.g. using Yelp/Google),
 * you can keep them below this comment, e.g.:
 *
 * router.get("/", async (req, res) => { ... });
 * router.get("/:id", async (req, res) => { ... });
 */

export default router;