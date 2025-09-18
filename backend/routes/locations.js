const express = require('express');
const Location = require('../models/Location');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/locations
// @desc    Get all locations
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const locations = await Location.find({ status: 'Active' }).sort({ name: 1 });
    res.json({
      success: true,
      locations
    });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error while fetching locations' });
  }
});

module.exports = router;

