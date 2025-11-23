import mongoose from 'mongoose';

// Try different URI formats
const uris = [
  'mongodb+srv://bitewise_user:CP317@cluster0.8nxvjch.mongodb.net/bitewise?appName=Cluster0',
  'mongodb+srv://bitewise_user:CP317@cluster0.8nxvjch.mongodb.net/bitewise?retryWrites=true&w=majority',
  'mongodb+srv://bitewise_user:CP317@cluster0.8nxvjch.mongodb.net/?retryWrites=true&w=majority'
];

async function testConnection(uri, index) {
  console.log(`\nTesting URI ${index + 1}...`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connection successful!');
    await mongoose.disconnect();
    return true;
  } catch (err) {
    console.log('❌ Failed:', err.message);
    return false;
  }
}

(async () => {
  for (let i = 0; i < uris.length; i++) {
    const success = await testConnection(uris[i], i);
    if (success) break;
  }
  process.exit(0);
})();
