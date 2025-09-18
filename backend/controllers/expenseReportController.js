const ExpenseReport = require('../models/ExpenseReport');
const User = require('../models/User');

// @desc    Create new expense report
// @route   POST /api/expense-reports
// @access  Private
const createExpenseReport = async (req, res) => {
  try {
    const {
      hotelName,
      reportDate,
      storeAndPurchase,
      departmentBills,
      storeInventory,
      powerConsumption,
      summary
    } = req.body;

    // Create new expense report
    const expenseReport = new ExpenseReport({
      userId: req.user.id,
      hotelName,
      reportDate: new Date(reportDate),
      storeAndPurchase: storeAndPurchase || { purchaseDetails: [] },
      departmentBills: departmentBills || { bills: [] },
      storeInventory: storeInventory || { inventoryItems: [] },
      powerConsumption: powerConsumption || { consumptionDetails: [] },
      summary: summary || {}
    });

    const savedReport = await expenseReport.save();

    res.status(201).json({
      success: true,
      data: savedReport
    });
  } catch (error) {
    console.error('Create expense report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while creating expense report' 
    });
  }
};

// @desc    Get all expense reports for a user
// @route   GET /api/expense-reports
// @access  Private
const getExpenseReports = async (req, res) => {
  try {
    const { hotelName, status, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = { userId: req.user.id };
    
    if (hotelName) {
      filter.hotelName = { $regex: hotelName, $options: 'i' };
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate && endDate) {
      filter.reportDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const expenseReports = await ExpenseReport.find(filter)
      .populate('userId', 'name email')
      .populate('control.approvedBy', 'name email')
      .populate('control.lastModifiedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ExpenseReport.countDocuments(filter);

    res.json({
      success: true,
      data: {
        expenseReports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get expense reports error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching expense reports' 
    });
  }
};

// @desc    Get single expense report by ID
// @route   GET /api/expense-reports/:id
// @access  Private
const getExpenseReportById = async (req, res) => {
  try {
    const expenseReport = await ExpenseReport.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('control.approvedBy', 'name email')
      .populate('control.lastModifiedBy', 'name email');

    if (!expenseReport) {
      return res.status(404).json({
        success: false,
        message: 'Expense report not found'
      });
    }

    // Check if user has access to this report
    if (expenseReport.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this expense report'
      });
    }

    res.json({
      success: true,
      data: expenseReport
    });
  } catch (error) {
    console.error('Get expense report by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching expense report' 
    });
  }
};

// @desc    Update expense report
// @route   PUT /api/expense-reports/:id
// @access  Private
const updateExpenseReport = async (req, res) => {
  try {
    const {
      hotelName,
      reportDate,
      storeAndPurchase,
      departmentBills,
      storeInventory,
      powerConsumption,
      summary
    } = req.body;

    const expenseReport = await ExpenseReport.findById(req.params.id);

    if (!expenseReport) {
      return res.status(404).json({
        success: false,
        message: 'Expense report not found'
      });
    }

    // Check if user has access to update this report
    if (expenseReport.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this expense report'
      });
    }

    // Check if report is locked
    if (expenseReport.control.isLocked) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update locked expense report'
      });
    }

    // Update fields
    if (hotelName) expenseReport.hotelName = hotelName;
    if (reportDate) expenseReport.reportDate = new Date(reportDate);
    if (storeAndPurchase) expenseReport.storeAndPurchase = storeAndPurchase;
    if (departmentBills) expenseReport.departmentBills = departmentBills;
    if (storeInventory) expenseReport.storeInventory = storeInventory;
    if (powerConsumption) expenseReport.powerConsumption = powerConsumption;
    if (summary) expenseReport.summary = summary;

    // Update control information
    expenseReport.control.lastModifiedBy = req.user.id;
    expenseReport.control.lastModifiedAt = new Date();

    const updatedReport = await expenseReport.save();

    res.json({
      success: true,
      data: updatedReport
    });
  } catch (error) {
    console.error('Update expense report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while updating expense report' 
    });
  }
};

// @desc    Delete expense report
// @route   DELETE /api/expense-reports/:id
// @access  Private
const deleteExpenseReport = async (req, res) => {
  try {
    const expenseReport = await ExpenseReport.findById(req.params.id);

    if (!expenseReport) {
      return res.status(404).json({
        success: false,
        message: 'Expense report not found'
      });
    }

    // Check if user has access to delete this report
    if (expenseReport.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this expense report'
      });
    }

    // Check if report is locked
    if (expenseReport.control.isLocked) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete locked expense report'
      });
    }

    await ExpenseReport.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Expense report deleted successfully'
    });
  } catch (error) {
    console.error('Delete expense report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting expense report' 
    });
  }
};

// @desc    Submit expense report for approval
// @route   PUT /api/expense-reports/:id/submit
// @access  Private
const submitExpenseReport = async (req, res) => {
  try {
    const expenseReport = await ExpenseReport.findById(req.params.id);

    if (!expenseReport) {
      return res.status(404).json({
        success: false,
        message: 'Expense report not found'
      });
    }

    // Check if user has access to submit this report
    if (expenseReport.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this expense report'
      });
    }

    // Check if report is already submitted or approved
    if (expenseReport.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Expense report is already submitted or approved'
      });
    }

    expenseReport.status = 'submitted';
    expenseReport.control.lastModifiedBy = req.user.id;
    expenseReport.control.lastModifiedAt = new Date();

    const updatedReport = await expenseReport.save();

    res.json({
      success: true,
      data: updatedReport
    });
  } catch (error) {
    console.error('Submit expense report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while submitting expense report' 
    });
  }
};

// @desc    Approve or reject expense report
// @route   PUT /api/expense-reports/:id/approve
// @access  Private (Admin/Manager only)
const approveExpenseReport = async (req, res) => {
  try {
    const { status, approvalNotes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either approved or rejected'
      });
    }

    const expenseReport = await ExpenseReport.findById(req.params.id);

    if (!expenseReport) {
      return res.status(404).json({
        success: false,
        message: 'Expense report not found'
      });
    }

    // Check if user has admin/manager role
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve expense reports'
      });
    }

    // Check if report is submitted
    if (expenseReport.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        message: 'Expense report must be submitted before approval'
      });
    }

    expenseReport.status = status;
    expenseReport.control.approvedBy = req.user.id;
    expenseReport.control.approvedAt = new Date();
    expenseReport.control.approvalNotes = approvalNotes || '';
    expenseReport.control.isLocked = true; // Lock the report after approval
    expenseReport.control.lastModifiedBy = req.user.id;
    expenseReport.control.lastModifiedAt = new Date();

    const updatedReport = await expenseReport.save();

    res.json({
      success: true,
      data: updatedReport
    });
  } catch (error) {
    console.error('Approve expense report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while approving expense report' 
    });
  }
};

// @desc    Get expense report statistics
// @route   GET /api/expense-reports/stats
// @access  Private
const getExpenseReportStats = async (req, res) => {
  try {
    const { hotelName, startDate, endDate } = req.query;
    
    // Build filter object
    const filter = { userId: req.user.id };
    
    if (hotelName) {
      filter.hotelName = { $regex: hotelName, $options: 'i' };
    }
    
    if (startDate && endDate) {
      filter.reportDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await ExpenseReport.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          totalExpenses: { $sum: '$summary.totalExpenses' },
          totalRevenue: { $sum: '$summary.totalRevenue' },
          totalNetProfit: { $sum: '$summary.netProfit' },
          averageProfitMargin: { $avg: '$summary.profitMargin' },
          draftCount: {
            $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] }
          },
          submittedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'submitted'] }, 1, 0] }
          },
          approvedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalReports: 0,
      totalExpenses: 0,
      totalRevenue: 0,
      totalNetProfit: 0,
      averageProfitMargin: 0,
      draftCount: 0,
      submittedCount: 0,
      approvedCount: 0,
      rejectedCount: 0
    };

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get expense report stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching expense report statistics' 
    });
  }
};

module.exports = {
  createExpenseReport,
  getExpenseReports,
  getExpenseReportById,
  updateExpenseReport,
  deleteExpenseReport,
  submitExpenseReport,
  approveExpenseReport,
  getExpenseReportStats
};
