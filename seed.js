require('dotenv').config(); // Must be at the very top
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Verify environment variable is loaded
if (!process.env.MONGODB_URI) {
  console.error('ERROR: MONGODB_URI not found in .env file');
  process.exit(1);
}

console.log('Connecting to MongoDB...');

// Import models
const State = require('./models/state');

// Load your JSON data
const indiaData = JSON.parse(fs.readFileSync(path.join(__dirname, 'india-data.json'), 'utf-8'));

async function seedDatabase() {
  try {
    // Connect to MongoDB with timeout settings
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // Close sockets after 45s inactivity
    });
    console.log('✅ MongoDB connected');

    // Clear existing data
    console.log('Clearing existing data...');
    await State.deleteMany({});
    console.log('✅ Data cleared');

    // Insert new data
    console.log('Inserting new data...');
    const statesToInsert = indiaData.states.map(state => ({
      name: state.state,
      districts: state.districts.map(district => ({
        name: district.name,
        towns: district.towns
      }))
    }));

    await State.insertMany(statesToInsert);
    console.log(`✅ Inserted ${statesToInsert.length} states with districts`);

    // Verify counts
    const stateCount = await State.countDocuments();
    const districtCount = (await State.aggregate([
      { $project: { count: { $size: "$districts" } } },
      { $group: { _id: null, total: { $sum: "$count" } } }
    ]))[0]?.total || 0;

    console.log(`Database now contains:`);
    console.log(`- States: ${stateCount}`);
    console.log(`- Districts: ${districtCount}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();