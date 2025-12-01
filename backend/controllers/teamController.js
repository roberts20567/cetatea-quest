// backend/controllers/teamController.js
const Team = require('../models/Team');
const jwt = require('jsonwebtoken');

// Helper function to generate a token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // The token will be valid for 30 days
  });
};

// @desc    Register a new team
// @route   POST /api/teams/register
// @access  Public
const registerTeam = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    const teamExists = await Team.findOne({ username: username.toLowerCase() });

    if (teamExists) {
      return res.status(400).json({ message: 'Team with that username already exists' });
    }

    const team = await Team.create({
      username,
      password,
    });

    if (team) {
      res.status(201).json({
        _id: team._id,
        username: team.username,
        role: team.role,
        token: generateToken(team._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid team data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Authenticate a team & get token
// @route   POST /api/teams/login
// @access  Public
const loginTeam = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find team by username and explicitly include the password
    const team = await Team.findOne({ username: username.toLowerCase() }).select('+password');

    // Check if team exists and if password matches
    if (team && (await team.matchPassword(password))) {
      res.json({
        _id: team._id,
        username: team.username,
        role: team.role,
        token: generateToken(team._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc Get all teams (for admin view)
// @route GET /api/teams/admin/all
// @access Private/Admin
const getAllTeams = async (req, res) => {
    try {
    const teams = await Team.find({}).select('_id username');
    res.json(teams);
    } catch (error) {
    res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Set quest start for the logged-in team
// @route   POST /api/teams/start
// @access  Private (Team)
const startQuest = async (req, res) => {
  try {
    const team = await Team.findById(req.team._id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (!team.questStart) {
      team.questStart = new Date();
      await team.save();
    }
    res.json({ questStart: team.questStart });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current team info (including quest times)
// @route   GET /api/teams/me
// @access  Private (Team)
const getMyTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.team._id).select('_id username questStart questEnd');
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerTeam,
  loginTeam,
  getAllTeams,
  startQuest,
  getMyTeam
};