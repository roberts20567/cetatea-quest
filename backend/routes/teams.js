// backend/routes/teams.js
const express = require('express');
const router = express.Router();
const { registerTeam, loginTeam, getAllTeams } = require('../controllers/teamController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route for registering a new team
router.post('/register', registerTeam);

// Route for logging in a team
router.post('/login', loginTeam);

// Route for admin to get all teams
router.get('/admin/all', protect, admin, getAllTeams);

module.exports = router;