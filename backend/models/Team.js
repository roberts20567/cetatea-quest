// backend/models/Team.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const teamSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false // Password won't be returned in queries by default
  },
  role: {
    type: String,
    enum: ['team', 'admin'],
    default: 'team'
  }
  ,
  questStart: {
    type: Date
  },
  questEnd: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Middleware: Encrypt password before saving the document
teamSchema.pre('save', async function() {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return;
  }

  // Generate a salt
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with the hashed password
teamSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Team', teamSchema);