// backend/routes/submissions.js
const express = require('express');
const router = express.Router();
const {
  createOrUpdateSubmission,
  getMySubmissions,
  deleteSubmission,
  getSubmissionsForCheckpoint,
  getSubmissionsForTeam
} = require('../controllers/submissionController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Create or update a submission (handles file upload)
router.route('/').post(protect, upload, createOrUpdateSubmission);

router.route('/my-submissions').get(protect, getMySubmissions);

router.route('/:id').delete(protect, deleteSubmission);

// Admin routes
router.route('/admin/by-checkpoint/:checkpointId').get(protect, admin, getSubmissionsForCheckpoint);

router.route('/admin/by-team/:teamId').get(protect, admin, getSubmissionsForTeam);

module.exports = router;