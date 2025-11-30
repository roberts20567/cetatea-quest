// backend/models/Checkpoint.js
const mongoose = require('mongoose');

const checkpointSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  hint: {
    type: String
  },
  // Path to an image associated with the checkpoint itself (e.g., a picture of the location)
  image: {
    type: String
  },
  order: { // To control the display order for teams
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Checkpoint', checkpointSchema);