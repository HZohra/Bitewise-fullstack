// Quick script to check .env format
import dotenv from "dotenv";
import fs from "fs";

try {
  dotenv.config();
  
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.log("❌ MONGODB_URI not found in .env");
    process.exit(1);
  }
  
  console.log("📋 Current MONGODB_URI format check:\n");
  console.log("Connection string (masked):");
  console.log(`   ${uri.replace(/:[^:@]+@/, ":****@")}\n`);
  
  // Check for database name
  const hasDbName = /mongodb\+srv:\/\/[^/]+\/([^?]+)/.test(uri);
  if (!hasDbName || uri.match(/mongodb\+srv:\/\/[^/]+\/\?/)) {
    console.log("⚠️  ISSUE: Database name is missing or incorrect!");
    console.log("   Your connection string should have: /bitewise (or your database name)");
    console.log("   Example: mongodb+srv://user:pass@cluster.net/bitewise?retryWrites=true&w=majority\n");
  } else {
    const dbMatch = uri.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/);
    if (dbMatch) {
      console.log(`✅ Database name found: ${dbMatch[1]}`);
    }
  }
  
  // Check query parameters
  if (uri.includes('appName=') && !uri.includes('retryWrites=true')) {
    console.log("⚠️  ISSUE: Query parameters should be: ?retryWrites=true&w=majority");
    console.log("   Not: ?appName=Cluster0\n");
  } else if (uri.includes('retryWrites=true')) {
    console.log("✅ Query parameters look correct");
  }
  
  console.log("\n📝 Correct format should be:");
  console.log("   mongodb+srv://bitewise_user:PASSWORD@cluster0.8nxvjch.mongodb.net/bitewise?retryWrites=true&w=majority");
  console.log("\n   Where:");
  console.log("   - PASSWORD: Your actual password (URL-encoded if it has special chars)");
  console.log("   - /bitewise: Your database name");
  console.log("   - ?retryWrites=true&w=majority: Required query parameters");
  
} catch (error) {
  console.error("Error:", error.message);
}

