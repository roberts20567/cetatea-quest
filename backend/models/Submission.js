// backend/models/Submission.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team', // This creates a direct link to the Team model
    required: true
  },
  checkpointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Checkpoint', // This creates a direct link to the Checkpoint model
    required: true
  },
  // The URL of the image uploaded by the team
  imageUrl: {
    type: String,
    required: true
  },
  // An optional caption the team can add to their submission
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