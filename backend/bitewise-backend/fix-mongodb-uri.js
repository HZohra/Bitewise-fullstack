// Helper script to fix MongoDB URI format
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const currentUri = process.env.MONGODB_URI;

if (!currentUri) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1);
}

console.log("🔍 Current connection string:");
console.log(`   ${currentUri.replace(/:[^:@]+@/, ":****@")}\n`);

// Check if database name is missing
const uriPattern = /mongodb\+srv:\/\/[^/]+(\/.*)?(\?|$)/;
const match = currentUri.match(uriPattern);

if (!match || !match[1] || match[1] === '/') {
  console.log("⚠️  Database name is missing in connection string!\n");
  console.log("📝 Your connection string should look like:");
  console.log("   mongodb+srv://username:password@cluster.mongodb.net/bitewise?retryWrites=true&w=majority\n");
  
  // Extract parts
  const parts = currentUri.split('@');
  if (parts.length === 2) {
    const [credentials, rest] = parts;
    const clusterPart = rest.split('/')[0].split('?')[0];
    
    console.log("💡 Suggested fix:");
    console.log(`   Add '/bitewise' after the cluster name\n`);
    console.log("   Example:");
    console.log(`   mongodb+srv://${credentials}@${clusterPart}/bitewise?retryWrites=true&w=majority\n`);
  }
} else {
  console.log("✅ Database name is present in connection string");
}

// Check for password encoding issues
if (currentUri.includes('@') && !currentUri.includes('%')) {
  console.log("\n💡 Password encoding:");
  console.log("   If your password has special characters, they need URL encoding:");
  console.log("   @ → %40, # → %23, $ → %24, & → %26, + → %2B, = → %3D, ? → %3F");
}

console.log("\n📋 Common fixes:");
console.log("1. Add database name: /bitewise (or your database name)");
console.log("2. Use proper query params: ?retryWrites=true&w=majority");
console.log("3. URL-encode special characters in password");
console.log("4. Verify username and password in MongoDB Atlas");
console.log("5. Check IP whitelist in MongoDB Atlas Network Access");

