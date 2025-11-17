// src/config/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("⚠️ MONGODB_URI is not set in .env. Database will not connect.");
}

export async function connectDB() {
  try {
    if (!MONGODB_URI) {
      console.warn("⚠️ Skipping DB connection because MONGODB_URI is missing.");
      return;
    }

    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // crash the app if DB cannot connect
  }
}
