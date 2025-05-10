// models/state.js
const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  districts: [{
    name: String,
    towns: [String]
  }]
});

module.exports = mongoose.model('State', stateSchema);