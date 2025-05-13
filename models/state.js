const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  districts: [{
    name: { type: String, required: true },
    towns: [{ type: String, required: true }]
  }]
});

module.exports = mongoose.model('State', stateSchema);