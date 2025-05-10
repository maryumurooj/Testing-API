require('dotenv').config();
const mongoose = require('mongoose');
const State = require('./models/state'); // Create this model file

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding');

    // Sample data - add all Indian states
    const indianStates = [
      {
        name: "Maharashtra",
        districts: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"]
      },
      {
        name: "Karnataka",
        districts: ["Bangalore Urban", "Mysuru", "Belagavi", "Hubballi-Dharwad"]
      },
      // Add more states as needed
      {
        name: "Tamil Nadu",
        districts: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"]
      }
    ];

    await State.deleteMany({});
    await State.insertMany(indianStates);
    
    console.log(`${indianStates.length} states inserted`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();