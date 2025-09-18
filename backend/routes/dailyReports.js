const express = require('express');
const {
  submitDailyReport,
  saveDraft,
  getDailyReports,
  getDailyReport,
  updateDailyReport,
  deleteDailyReport,
  getDailyReportStats,
  getRevenueBreakdown
} = require('../controllers/dailyReportController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/daily-reports
// @desc    Submit daily report
// @access  Private
router.post('/', submitDailyReport);

// @route   POST /api/daily-reports/draft
// @desc    Save draft report
// @access  Private
router.post('/draft', saveDraft);

// @route   GET /api/daily-reports
// @desc    Get daily reports
// @access  Private
router.get('/', getDailyReports);

// @route   GET /api/daily-reports/stats
// @desc    Get daily report statistics
// @access  Private
router.get('/stats', getDailyReportStats);

// @route   GET /api/daily-reports/revenue-breakdown
// @desc    Get revenue breakdown from daily reports
// @access  Private
router.get('/revenue-breakdown', getRevenueBreakdown);

// @route   GET /api/daily-reports/test
// @desc    Test endpoint to check daily reports data
// @access  Private
router.get('/test', async (req, res) => {
  try {
    const { location } = req.query;
    let query = {};
    
    if (location) {
      query.resortName = location;
    }
    
    const reports = await require('../models/DailyReport').find(query).limit(5);
    
    res.json({
      success: true,
      data: {
        totalReports: reports.length,
        reports: reports.map(report => ({
          id: report._id,
          resortName: report.resortName,
          status: report.status,
          submittedAt: report.submittedAt,
          callCentreRevenue: report.callCentreRevenue,
          travelAgentRevenue: report.travelAgentRevenue,
          otaRevenue: report.otaRevenue,
          walkInRevenue: report.walkInRevenue,
          salesManagerRevenue: report.salesManagerRevenue,
          clubMahindraRevenue: report.clubMahindraRevenue,
          totalRoomRevenue: report.totalRoomRevenue
        }))
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ message: 'Server error in test endpoint' });
  }
});

// @route   GET /api/daily-reports/:id
// @desc    Get specific daily report
// @access  Private
router.get('/:id', getDailyReport);

// @route   PUT /api/daily-reports/:id
// @desc    Update daily report
// @access  Private
router.put('/:id', updateDailyReport);

// @route   DELETE /api/daily-reports/:id
// @desc    Delete daily report
// @access  Private
router.delete('/:id', deleteDailyReport);

module.exports = router;
