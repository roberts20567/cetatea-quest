// backend/controllers/checkpointController.js
const Checkpoint = require('../models/Checkpoint');
const Submission = require('../models/Submission');

// @desc    Create a checkpoint
// @route   POST /api/checkpoints
// @access  Private (Admin)
const createCheckpoint = async (req, res) => {
  const { title, description, hint, order } = req.body;
  
  let image;
  if (req.file) {
    image = req.file.path.replace(/\\/g, '/');
  }

  try {
    const checkpoint = new Checkpoint({
      title,
      description,
      hint,
      image,
      order,
    });

    const createdCheckpoint = await checkpoint.save();
    res.status(201).json(createdCheckpoint);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all checkpoints
// @route   GET /api/checkpoints
// @access  Private (All logged-in teams)
const getCheckpoints = async (req, res) => {
  try {
    const checkpoints = await Checkpoint.find({}).sort('order');
    res.json(checkpoints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update a checkpoint
// @route   PUT /api/checkpoints/:id
// @access  Private (Admin)
const updateCheckpoint = async (req, res) => {
  const { title, description, hint, order } = req.body;

  try {
    const checkpoint = await Checkpoint.findById(req.params.id);

    if (checkpoint) {
      checkpoint.title = title || checkpoint.title;
      checkpoint.description = description || checkpoint.description;
      checkpoint.hint = hint || checkpoint.hint;
      checkpoint.order = order !== undefined ? order : checkpoint.order;

      if (req.file) {
        checkpoint.image = req.file.path.replace(/\\/g, '/');
      }

      const updatedCheckpoint = await checkpoint.save();
      res.json(updatedCheckpoint);
    } else {
      res.status(404).json({ message: 'Checkpoint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a checkpoint
// @route   DELETE /api/checkpoints/:id
// @access  Private (Admin)
const deleteCheckpoint = async (req, res) => {
  try {
    const checkpoint = await Checkpoint.findById(req.params.id);

    if (checkpoint) {
      // Optional: Also delete all submissions associated with this checkpoint
      await Submission.deleteMany({ checkpointId: checkpoint._id });
      
      await checkpoint.deleteOne();
      res.json({ message: 'Checkpoint removed' });
    } else {
      res.status(404).json({ message: 'Checkpoint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createCheckpoint,
  getCheckpoints,
  updateCheckpoint,
  deleteCheckpoint,
};