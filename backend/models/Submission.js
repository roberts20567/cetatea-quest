// backend/models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  checkpointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Checkpoint',
    required: true
  },
  imageUrl: {
    type: String,
  },
  textSubmission: {
    type: String
  },
  caption: {
    type: String
  }
}, {
  timestamps: true
});

// This compound index is a powerful database rule.
// It ensures that the combination of a teamId and a checkpointId is always unique.
// This means a team cannot have two separate submission documents for the same checkpoint.
submissionSchema.index({ teamId: 1, checkpointId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);