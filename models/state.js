const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  districts: [{
    type: String,
    required: true
  }]
});

module.exports = mongoose.model('State', stateSchema);