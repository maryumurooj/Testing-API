require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
};

connectDB();

// State Model (must match your seed data structure)
const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  districts: [{
    name: String,
    towns: [String]
  }]
});

const State = mongoose.model('State', stateSchema);

// API Routes
app.get('/states', async (req, res) => {
  try {
    const states = await State.find({}, 'name');
    res.json(states);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/states/:stateName/districts', async (req, res) => {
  try {
    const state = await State.findOne({ name: req.params.stateName });
    if (!state) return res.status(404).json({ error: 'State not found' });
    
    const districts = state.districts.map(d => d.name);
    res.json(districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/states/:stateName/districts/:districtName/towns', async (req, res) => {
  try {
    const state = await State.findOne({ name: req.params.stateName });
    if (!state) return res.status(404).json({ error: 'State not found' });
    
    const district = state.districts.find(d => d.name === req.params.districtName);
    if (!district) return res.status(404).json({ error: 'District not found' });
    
    res.json(district.towns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));