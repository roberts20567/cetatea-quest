// backend/routes/checkpoints.js
const express = require('express');
const router = express.Router();
const {
  createCheckpoint,
  getCheckpoints,
  updateCheckpoint,
  deleteCheckpoint,
} = require('../controllers/checkpointController');
const { protect, admin } = require('../middleware/authMiddleware');

const checkpointUpload = require('../middleware/checkpointUploadMiddleware');

// Any logged-in team can view checkpoints
router.route('/').get(protect, getCheckpoints);

// Only admins can create, update, or delete checkpoints
router.route('/').post(protect, admin, checkpointUpload, createCheckpoint);
router.route('/:id').put(protect, admin, checkpointUpload, updateCheckpoint).delete(protect, admin, deleteCheckpoint);

module.exports = router;