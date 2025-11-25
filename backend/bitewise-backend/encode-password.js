// Password URL Encoding Helper
// This helps you encode special characters in your MongoDB password

const password = process.argv[2];

if (!password) {
  console.log("🔐 MongoDB Password Encoder\n");
  console.log("Usage: node encode-password.js 'your-password-here'");
  console.log("\nExample:");
  console.log("  node encode-password.js 'MyP@ss#123'");
  console.log("  Output: MyP%40ss%23123\n");
  console.log("Special characters that need encoding:");
  console.log("  @ → %40");
  console.log("  # → %23");
  console.log("  $ → %24");
  console.log("  & → %26");
  console.log("  + → %2B");
  console.log("  = → %3D");
  console.log("  ? → %3F");
  console.log("  / → %2F");
  console.log("  : → %3A");
  process.exit(1);
}

const encoded = encodeURIComponent(password);
console.log("\n🔐 Password Encoding Result:\n");
console.log(`Original:  ${password}`);
console.log(`Encoded:  ${encoded}\n`);
console.log("📝 Use the encoded version in your MONGODB_URI:");
console.log(`   mongodb+srv://bitewise_user:${encoded}@cluster0.8nxvjch.mongodb.net/bitewise?retryWrites=true&w=majority\n`);

