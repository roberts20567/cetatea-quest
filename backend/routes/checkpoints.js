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

// Any logged-in team can view checkpoints
router.route('/').get(protect, getCheckpoints);

// Only admins can create, update, or delete checkpoints
router.route('/').post(protect, admin, createCheckpoint);
router.route('/:id').put(protect, admin, updateCheckpoint).delete(protect, admin, deleteCheckpoint);

module.exports = router;