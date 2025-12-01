// backend/routes/teams.js
const express = require('express');
const router = express.Router();
const { registerTeam, loginTeam, getAllTeams, startQuest, getMyTeam } = require('../controllers/teamController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route for registering a new team
router.post('/register', registerTeam);

// Route for logging in a team
router.post('/login', loginTeam);

// Route for admin to get all teams
router.get('/admin/all', protect, admin, getAllTeams);

// Route for a team to set their quest start time
router.post('/start', protect, startQuest);

// Route to get the current team's info
router.get('/me', protect, getMyTeam);

module.exports = router;