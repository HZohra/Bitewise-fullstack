import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

console.log("🔍 Testing MongoDB connection...\n");
console.log(
  "📡 Connection string:",
  uri ? uri.replace(/:(.*?)@/, ":****@") : "MISSING"
);
console.log("\n⏳ Attempting to connect...\n");

async function testConnection() {
  if (!uri) {
    console.error("❌ MONGODB_URI is missing from .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ MongoDB test connection SUCCESS!");
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection failed!");
    console.error("   Error:", err.message);
    process.exit(1);
  }
}

testConnection();