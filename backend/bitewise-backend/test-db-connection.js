import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("Testing MongoDB connection...");
console.log("URI (masked):", MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log("✅ MongoDB connection successful!");
    console.log("Database:", mongoose.connection.db.databaseName);
    
    await mongoose.connection.close();
    console.log("Connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    console.error("Full error:", err);
    process.exit(1);
  }
}

testConnection();
