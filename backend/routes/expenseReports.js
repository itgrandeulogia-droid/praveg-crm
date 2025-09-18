const express = require('express');
const {
  createExpenseReport,
  getExpenseReports,
  getExpenseReportById,
  updateExpenseReport,
  deleteExpenseReport,
  submitExpenseReport,
  approveExpenseReport,
  getExpenseReportStats
} = require('../controllers/expenseReportController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   POST /api/expense-reports
// @desc    Create new expense report
// @access  Private
router.post('/', createExpenseReport);

// @route   GET /api/expense-reports
// @desc    Get all expense reports for a user
// @access  Private
router.get('/', getExpenseReports);

// @route   GET /api/expense-reports/stats
// @desc    Get expense report statistics
// @access  Private
router.get('/stats', getExpenseReportStats);

// @route   GET /api/expense-reports/:id
// @desc    Get single expense report by ID
// @access  Private
router.get('/:id', getExpenseReportById);

// @route   PUT /api/expense-reports/:id
// @desc    Update expense report
// @access  Private
router.put('/:id', updateExpenseReport);

// @route   DELETE /api/expense-reports/:id
// @desc    Delete expense report
// @access  Private
router.delete('/:id', deleteExpenseReport);

// @route   PUT /api/expense-reports/:id/submit
// @desc    Submit expense report for approval
// @access  Private
router.put('/:id/submit', submitExpenseReport);

// @route   PUT /api/expense-reports/:id/approve
// @desc    Approve or reject expense report
// @access  Private (Admin/Manager only)
router.put('/:id/approve', approveExpenseReport);

module.exports = router;
