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
  image: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['media', 'text'],
    default: 'media'
  },
  solution: {
    type: String,
    required: function() { return this.type === 'text'; }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Checkpoint', checkpointSchema);