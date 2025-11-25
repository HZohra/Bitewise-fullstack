import mongoose from 'mongoose';

// Test with different database names and options
const tests = [
  'mongodb+srv://bitewise_user:CP317@cluster0.8nxvjch.mongodb.net/bitewise?retryWrites=true&w=majority',
  'mongodb+srv://bitewise_user:CP317@cluster0.8nxvjch.mongodb.net/test?retryWrites=true&w=majority',
  'mongodb+srv://bitewise_user:CP317@cluster0.8nxvjch.mongodb.net/?retryWrites=true&w=majority&authSource=admin',
];

for (const uri of tests) {
  console.log('\nTesting:', uri.replace('CP317', '****'));
  try {
    await mongoose.connect(uri, { 
      serverSelectionTimeoutMS: 5000,
      authSource: 'admin'
    });
    console.log('✅ SUCCESS!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log('❌', err.codeName || err.message);
    await mongoose.disconnect().catch(() => {});
  }
}
console.log('\nAll tests failed. Please verify credentials in Atlas.');
process.exit(1);
