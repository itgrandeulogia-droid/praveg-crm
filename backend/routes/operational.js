const express = require('express');
const {
  getOperationalStats,
  getResortRevenue,
  getResortOccupancy,
  getRevPARPerformance,
  getRevenueBreakdown,
  getResortPerformance,
  getRevenueMix
} = require('../controllers/operationalController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/operational/stats
// @desc    Get operational dashboard stats
// @access  Private
router.get('/stats', getOperationalStats);

// @route   GET /api/operational/revenue
// @desc    Get resort revenue data
// @access  Private
router.get('/revenue', getResortRevenue);

// @route   GET /api/operational/occupancy
// @desc    Get resort occupancy data
// @access  Private
router.get('/occupancy', getResortOccupancy);

// @route   GET /api/operational/revpar
// @desc    Get RevPAR performance data
// @access  Private
router.get('/revpar', getRevPARPerformance);

// @route   GET /api/operational/revenue-breakdown
// @desc    Get revenue breakdown data
// @access  Private
router.get('/revenue-breakdown', getRevenueBreakdown);

// @route   GET /api/operational/performance
// @desc    Get resort performance data
// @access  Private
router.get('/performance', getResortPerformance);

// @route   GET /api/operational/revenue-mix
// @desc    Get revenue mix data
// @access  Private
router.get('/revenue-mix', getRevenueMix);

module.exports = router;
