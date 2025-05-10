require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Improved MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process if can't connect
  });
  
  // Add this to verify connection status
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });
  
// Define schemas
const citySchema = new mongoose.Schema({
  name: String,
  district: String,
  state: String
});

const State = mongoose.model('State', new mongoose.Schema({
  name: String,
  districts: [String]
}));

const City = mongoose.model('City', citySchema);

// Routes
app.get('/states', async (req, res) => {
  try {
    const states = await State.find().select('name -_id');
    res.json(states.map(s => s.name));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/:state/districts', async (req, res) => {
  try {
    const state = await State.findOne({ name: req.params.state });
    if (!state) return res.status(404).json({ error: 'State not found' });
    res.json(state.districts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add more routes as needed

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));