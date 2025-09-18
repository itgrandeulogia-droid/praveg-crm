const DailyReport = require('../models/DailyReport');

// @desc    Submit daily report
// @route   POST /api/daily-reports
// @access  Private
const submitDailyReport = async (req, res) => {
  try {
    const reportData = req.body;
    
    // Create new daily report
    const dailyReport = new DailyReport(reportData);
    await dailyReport.save();

    res.status(201).json({
      success: true,
      data: { dailyReport },
      message: 'Daily report submitted successfully'
    });
  } catch (error) {
    console.error('Submit daily report error:', error);
    res.status(500).json({ message: 'Server error while submitting daily report' });
  }
};

// @desc    Save draft report
// @route   POST /api/daily-reports/draft
// @access  Private
const saveDraft = async (req, res) => {
  try {
    const reportData = req.body;
    
    // Create new draft report
    const dailyReport = new DailyReport({
      ...reportData,
      status: 'draft'
    });
    await dailyReport.save();

    res.status(201).json({
      success: true,
      data: { dailyReport },
      message: 'Draft saved successfully'
    });
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({ message: 'Server error while saving draft' });
  }
};

// @desc    Get daily reports
// @route   GET /api/daily-reports
// @access  Private
const getDailyReports = async (req, res) => {
  try {
    const { location, status, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
    let query = {};

    // Apply filters
    if (location) {
      query.resortName = location;
    }
    if (status) {
      query.status = status;
    }
    if (dateFrom || dateTo) {
      query.reportDate = {};
      if (dateFrom) query.reportDate.$gte = dateFrom;
      if (dateTo) query.reportDate.$lte = dateTo;
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    const dailyReports = await DailyReport.find(query)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DailyReport.countDocuments(query);

    res.json({
      success: true,
      data: {
        dailyReports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalReports: total,
          hasNext: skip + dailyReports.length < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get daily reports error:', error);
    res.status(500).json({ message: 'Server error while fetching daily reports' });
  }
};

// @desc    Get specific daily report
// @route   GET /api/daily-reports/:id
// @access  Private
const getDailyReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const dailyReport = await DailyReport.findById(id);
    if (!dailyReport) {
      return res.status(404).json({ message: 'Daily report not found' });
    }

    res.json({
      success: true,
      data: { dailyReport }
    });
  } catch (error) {
    console.error('Get daily report error:', error);
    res.status(500).json({ message: 'Server error while fetching daily report' });
  }
};

// @desc    Update daily report
// @route   PUT /api/daily-reports/:id
// @access  Private
const updateDailyReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const dailyReport = await DailyReport.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!dailyReport) {
      return res.status(404).json({ message: 'Daily report not found' });
    }

    res.json({
      success: true,
      data: { dailyReport },
      message: 'Daily report updated successfully'
    });
  } catch (error) {
    console.error('Update daily report error:', error);
    res.status(500).json({ message: 'Server error while updating daily report' });
  }
};

// @desc    Delete daily report
// @route   DELETE /api/daily-reports/:id
// @access  Private
const deleteDailyReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const dailyReport = await DailyReport.findByIdAndDelete(id);
    if (!dailyReport) {
      return res.status(404).json({ message: 'Daily report not found' });
    }

    res.json({
      success: true,
      message: 'Daily report deleted successfully'
    });
  } catch (error) {
    console.error('Delete daily report error:', error);
    res.status(500).json({ message: 'Server error while deleting daily report' });
  }
};

// @desc    Get daily report statistics
// @route   GET /api/daily-reports/stats
// @access  Private
const getDailyReportStats = async (req, res) => {
  try {
    const { location, dateFrom, dateTo } = req.query;
    let query = {};

    // Apply filters
    if (location) {
      query.resortName = location;
    }
    if (dateFrom || dateTo) {
      query.reportDate = {};
      if (dateFrom) query.reportDate.$gte = dateFrom;
      if (dateTo) query.reportDate.$lte = dateTo;
    }

    const stats = await DailyReport.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          totalRevenue: { $sum: '$totalRevenueForDay' },
          averageOccupancy: { $avg: '$occupancyRatio' },
          totalRoomsOccupied: { $sum: '$roomsOccupied' },
          totalGuests: { $sum: '$totalGuests' }
        }
      }
    ]);

    const statusCounts = await DailyReport.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        stats: stats[0] || {
          totalReports: 0,
          totalRevenue: 0,
          averageOccupancy: 0,
          totalRoomsOccupied: 0,
          totalGuests: 0
        },
        statusCounts
      }
    });
  } catch (error) {
    console.error('Get daily report stats error:', error);
    res.status(500).json({ message: 'Server error while fetching daily report statistics' });
  }
};

// @desc    Get revenue breakdown from daily reports
// @route   GET /api/daily-reports/revenue-breakdown
// @access  Private
const getRevenueBreakdown = async (req, res) => {
  try {
    const { location, dateRange = 'last30days' } = req.query;
    let query = { status: 'submitted' }; // Only get submitted reports

    // Apply location filter
    if (location) {
      query.resortName = location;
    }

    // Apply date range filter
    const now = new Date();
    let dateFrom;
    switch (dateRange) {
      case 'last7days':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last90days':
        dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    query.submittedAt = { $gte: dateFrom };

    // Get all daily reports for the specified location and date range
    const dailyReports = await DailyReport.find(query);

    // Calculate revenue breakdown from the revenue sources
    const revenueSources = {
      'Call Centre': 0,
      'Travel Agent': 0,
      'OTA': 0,
      'Walk-In': 0,
      'Sales Manager': 0,
      'Club Mahindra': 0
    };

    let totalRevenue = 0;

    // Aggregate revenue from all reports
    dailyReports.forEach(report => {
      revenueSources['Call Centre'] += report.callCentreRevenue || 0;
      revenueSources['Travel Agent'] += report.travelAgentRevenue || 0;
      revenueSources['OTA'] += report.otaRevenue || 0;
      revenueSources['Walk-In'] += report.walkInRevenue || 0;
      revenueSources['Sales Manager'] += report.salesManagerRevenue || 0;
      revenueSources['Club Mahindra'] += report.clubMahindraRevenue || 0;
      
      totalRevenue += report.totalRoomRevenue || 0;
    });

    // Convert to array and calculate percentages
    const sources = Object.entries(revenueSources)
      .filter(([name, amount]) => amount > 0) // Only include sources with revenue
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount); // Sort by amount descending

    // Normalize percentages to ensure they don't exceed 100%
    if (sources.length > 0) {
      const totalPercentage = sources.reduce((sum, source) => sum + source.percentage, 0);
      
      console.log('Revenue breakdown calculation:', {
        totalRevenue,
        sources: sources.map(s => ({ name: s.name, amount: s.amount, percentage: s.percentage })),
        totalPercentage
      });
      
      if (totalPercentage > 100) {
        // Normalize by scaling down all percentages proportionally
        const scaleFactor = 100 / totalPercentage;
        sources.forEach(source => {
          source.percentage = Math.round(source.percentage * scaleFactor);
        });
        
        console.log('Normalized percentages:', {
          scaleFactor,
          sources: sources.map(s => ({ name: s.name, percentage: s.percentage }))
        });
      }
      
      // Final validation - ensure no percentage exceeds 100%
      sources.forEach(source => {
        if (source.percentage > 100) {
          source.percentage = 100;
        }
        if (source.percentage < 0) {
          source.percentage = 0;
        }
      });
    }

    // Find top performer (highest percentage)
    const topPerformer = sources.length > 0 ? {
      name: sources[0].name,
      percentage: sources[0].percentage
    } : null;

    // Find growth opportunity (could be the one with most potential for growth)
    const growthOpportunity = sources.length > 0 ? {
      name: sources[sources.length - 1]?.name || sources[0].name,
      growth: Math.round(Math.random() * 20) + 5 // Mock growth percentage for now
    } : null;

    res.json({
      success: true,
      data: {
        totalRevenue,
        sources,
        topPerformer,
        growthOpportunity
      }
    });
  } catch (error) {
    console.error('Get revenue breakdown error:', error);
    res.status(500).json({ message: 'Server error while fetching revenue breakdown' });
  }
};

module.exports = {
  submitDailyReport,
  saveDraft,
  getDailyReports,
  getDailyReport,
  updateDailyReport,
  deleteDailyReport,
  getDailyReportStats,
  getRevenueBreakdown
};
