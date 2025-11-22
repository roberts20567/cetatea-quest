// backend/controllers/submissionController.js
const Submission = require('../models/Submission');
const Checkpoint = require('../models/Checkpoint');
const fs = require('fs');
const path = require('path');

// @desc    Create or update a submission for a checkpoint
// @route   POST /api/submissions
// @access  Private (Team)
const createOrUpdateSubmission = async (req, res) => {
  const { checkpointId, caption } = req.body;
  const teamId = req.team._id; // from protect middleware

  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an image' });
  }

  if (!checkpointId) {
    // If no checkpointId, delete the uploaded file
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'Checkpoint ID is required' });
  }

  try {
    const checkpoint = await Checkpoint.findById(checkpointId);
    if (!checkpoint) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Checkpoint not found' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Find existing submission to delete old image if it exists
    const existingSubmission = await Submission.findOne({ teamId, checkpointId });
    if (existingSubmission && existingSubmission.imageUrl) {
      const oldImagePath = path.join(__dirname, '..', existingSubmission.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Use findOneAndUpdate with upsert to create or update the submission
    const submission = await Submission.findOneAndUpdate(
      { teamId, checkpointId },
      { imageUrl, caption },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json(submission);
  } catch (error) {
    // If any error occurs, delete the uploaded file to prevent orphans
    fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all submissions for the logged-in team
// @route   GET /api/submissions/my-submissions
// @access  Private (Team)
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ teamId: req.team._id }).populate('checkpointId', 'title');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a submission
// @route   DELETE /api/submissions/:id
// @access  Private (Team)
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Ensure the team deleting the submission is the one who created it
    if (submission.teamId.toString() !== req.team._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete the image file from the server
    if (submission.imageUrl) {
      const imagePath = path.join(__dirname, '..', submission.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await submission.deleteOne();

    res.json({ message: 'Submission removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Get all submissions for a specific team
// @route GET /api/submissions/admin/by-team/:teamId
// @access Private (Admin)
const getSubmissionsForTeam = async (req, res) => {
    const submissions = await Submission.find({ teamId: req.params.teamId }).populate('checkpointId', 'title order');
    res.json(submissions);
};


// --- Admin Routes ---

// @desc    Get all submissions grouped by checkpoint
// @route   GET /api/submissions/admin/by-checkpoint/:checkpointId
// @access  Private (Admin)
const getSubmissionsForCheckpoint = async (req, res) => {
    const submissions = await Submission.find({ checkpointId: req.params.checkpointId }).populate('teamId', 'username');
    res.json(submissions);
};

module.exports = {
  createOrUpdateSubmission,
  getMySubmissions,
  deleteSubmission,
  getSubmissionsForCheckpoint,
  getSubmissionsForTeam
};