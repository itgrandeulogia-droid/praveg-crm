const express = require('express');
const Department = require('../models/Department');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const departments = await Department.find({ status: 'Active' }).sort({ name: 1 });
    res.json({
      success: true,
      departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ message: 'Server error while fetching departments' });
  }
});

module.exports = router;

