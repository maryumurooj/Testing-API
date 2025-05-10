const mongoose = require('mongoose');
require('dotenv').config();

async function seedDatabase() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const State = mongoose.model('State', {
    name: String,
    districts: [String]
  });

  const sampleData = [
    {
      name: "Maharashtra",
      districts: ["Mumbai", "Pune", "Nagpur", "Thane"]
    },
    {
      name: "Karnataka",
      districts: ["Bangalore Urban", "Mysore", "Belgaum"]
    }
    // Add all states and districts
  ];

  await State.deleteMany({});
  await State.insertMany(sampleData);
  console.log("Database seeded!");
  process.exit(0);
}

seedDatabase().catch(console.error);