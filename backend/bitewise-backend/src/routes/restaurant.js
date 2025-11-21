import express from "express";
import { findRestaurants } from "../services/restaurantService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { lat, lon, radius } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "lat and lon query parameters are required" });
  }

  try {
    const restaurants = await findRestaurants(parseFloat(lat), parseFloat(lon), radius ? parseInt(radius) : undefined);
    res.json(restaurants);
  } catch (error) {
    console.error("Failed to fetch restaurants:", error);
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});

export default router;
