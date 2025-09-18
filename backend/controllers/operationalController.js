// @desc    Get operational dashboard stats
// @route   GET /api/operational/stats
// @access  Private
const getOperationalStats = async (req, res) => {
  try {
    const { location } = req.query;
    
    // Dynamic operational stats based on location
    let stats;
    
    switch (location) {
      case 'Goa Beach Resort':
        stats = {
          totalRevenue: 680000,
          totalExpenses: 408000,
          grossOperatingProfit: 272000,
          averageOccupancy: 92,
          totalEmployees: 200,
          activeProjects: 12,
          attendanceRate: 96.2,
          gopScore: 82.5,
          dailyTasks: 31
        };
        break;
        
      case 'Kerala Backwaters Resort':
        stats = {
          totalRevenue: 420000,
          totalExpenses: 294000,
          grossOperatingProfit: 126000,
          averageOccupancy: 78,
          totalEmployees: 120,
          activeProjects: 6,
          attendanceRate: 91.8,
          gopScore: 75.4,
          dailyTasks: 18
        };
        break;
        
      case 'Diu - Ghogla':
        stats = {
          totalRevenue: 380000,
          totalExpenses: 266000,
          grossOperatingProfit: 114000,
          averageOccupancy: 85,
          totalEmployees: 156,
          activeProjects: 8,
          attendanceRate: 94.5,
          gopScore: 78.2,
          dailyTasks: 23
        };
        break;
        
      default:
        // Default stats for unknown locations
        stats = {
          totalRevenue: 510000,
          totalExpenses: 357000,
          grossOperatingProfit: 153000,
          averageOccupancy: 85,
          totalEmployees: 156,
          activeProjects: 8,
          attendanceRate: 94.5,
          gopScore: 78.2,
          dailyTasks: 23
        };
    }

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    console.error('Get operational stats error:', error);
    res.status(500).json({ message: 'Server error while fetching operational stats' });
  }
};

// @desc    Get resort revenue data
// @route   GET /api/operational/revenue
// @access  Private
const getResortRevenue = async (req, res) => {
  try {
    const { location } = req.query;
    
    // Dynamic revenue data based on location
    let revenueData;
    
    switch (location) {
      case 'Goa Beach Resort':
        revenueData = [
          { day: 'Mon', revenue: 25000 },
          { day: 'Tue', revenue: 22000 },
          { day: 'Wed', revenue: 28000 },
          { day: 'Thu', revenue: 35000 },
          { day: 'Fri', revenue: 32000 },
          { day: 'Sat', revenue: 40000 },
          { day: 'Sun', revenue: 35000 }
        ];
        break;
        
      case 'Kerala Backwaters Resort':
        revenueData = [
          { day: 'Mon', revenue: 15000 },
          { day: 'Tue', revenue: 12000 },
          { day: 'Wed', revenue: 18000 },
          { day: 'Thu', revenue: 22000 },
          { day: 'Fri', revenue: 20000 },
          { day: 'Sat', revenue: 25000 },
          { day: 'Sun', revenue: 22000 }
        ];
        break;
        
      case 'Diu - Ghogla':
        revenueData = [
          { day: 'Mon', revenue: 18000 },
          { day: 'Tue', revenue: 15000 },
          { day: 'Wed', revenue: 20000 },
          { day: 'Thu', revenue: 25000 },
          { day: 'Fri', revenue: 22000 },
          { day: 'Sat', revenue: 28000 },
          { day: 'Sun', revenue: 24000 }
        ];
        break;
        
      default:
        revenueData = [
          { day: 'Mon', revenue: 18750 },
          { day: 'Tue', revenue: 14062 },
          { day: 'Wed', revenue: 21875 },
          { day: 'Thu', revenue: 28125 },
          { day: 'Fri', revenue: 23437 },
          { day: 'Sat', revenue: 29687 },
          { day: 'Sun', revenue: 25000 }
        ];
    }

    res.json({
      success: true,
      data: { revenue: revenueData }
    });
  } catch (error) {
    console.error('Get resort revenue error:', error);
    res.status(500).json({ message: 'Server error while fetching resort revenue' });
  }
};

// @desc    Get resort occupancy data
// @route   GET /api/operational/occupancy
// @access  Private
const getResortOccupancy = async (req, res) => {
  try {
    const { location } = req.query;
    
    // Mock occupancy data
    const occupancyData = {
      current: 85,
      target: 90,
      trend: '+5.2%'
    };

    res.json({
      success: true,
      data: { occupancy: occupancyData }
    });
  } catch (error) {
    console.error('Get resort occupancy error:', error);
    res.status(500).json({ message: 'Server error while fetching resort occupancy' });
  }
};

// @desc    Get RevPAR performance data
// @route   GET /api/operational/revpar
// @access  Private
const getRevPARPerformance = async (req, res) => {
  try {
    const { location } = req.query;
    
    // Mock RevPAR data for the week
    const revparData = [
      { day: 'Mon', revpar: 3800 },
      { day: 'Tue', revpar: 4200 },
      { day: 'Wed', revpar: 3900 },
      { day: 'Thu', revpar: 4500 },
      { day: 'Fri', revpar: 4800 },
      { day: 'Sat', revpar: 5200 },
      { day: 'Sun', revpar: 4600 }
    ];

    res.json({
      success: true,
      data: { revpar: revparData }
    });
  } catch (error) {
    console.error('Get RevPAR performance error:', error);
    res.status(500).json({ message: 'Server error while fetching RevPAR performance' });
  }
};

// @desc    Get revenue breakdown data
// @route   GET /api/operational/revenue-breakdown
// @access  Private
const getRevenueBreakdown = async (req, res) => {
  try {
    const { location } = req.query;
    
    // Mock revenue breakdown data
    const breakdownData = [
      { source: 'OTA', percentage: 35, amount: 180000, color: 'blue' },
      { source: 'Call Centre', percentage: 27, amount: 140000, color: 'green' },
      { source: 'Travel Agent', percentage: 18, amount: 90000, color: 'yellow' },
      { source: 'Walk-In', percentage: 13, amount: 65000, color: 'purple' },
      { source: 'Club Mahindra', percentage: 7, amount: 35000, color: 'red' }
    ];

    res.json({
      success: true,
      data: { breakdown: breakdownData }
    });
  } catch (error) {
    console.error('Get revenue breakdown error:', error);
    res.status(500).json({ message: 'Server error while fetching revenue breakdown' });
  }
};

// @desc    Get resort performance data
// @route   GET /api/operational/performance
// @access  Private
const getResortPerformance = async (req, res) => {
  try {
    const { location } = req.query;
    
    // Mock performance data
    const performanceData = [
      {
        resort: location || 'Resort',
        manager: 'Manager',
        revenue: 125000,
        occupancy: 85,
        revpar: 4250,
        status: 'Active'
      }
    ];

    res.json({
      success: true,
      data: { performance: performanceData }
    });
  } catch (error) {
    console.error('Get resort performance error:', error);
    res.status(500).json({ message: 'Server error while fetching resort performance' });
  }
};

// @desc    Get revenue mix data
// @route   GET /api/operational/revenue-mix
// @access  Private
const getRevenueMix = async (req, res) => {
  try {
    const { location } = req.query;
    
    // Dynamic revenue mix data based on location
    let mixData;
    
    switch (location) {
      case 'Goa Beach Resort':
        mixData = {
          total: 680000,
          breakdown: [
            { category: 'Room Revenue', percentage: 70, amount: 476000, color: 'blue' },
            { category: 'F&B Revenue', percentage: 20, amount: 136000, color: 'green' },
            { category: 'Spa & Wellness', percentage: 6, amount: 40800, color: 'purple' },
            { category: 'Activities & Tours', percentage: 4, amount: 27200, color: 'yellow' }
          ]
        };
        break;
        
      case 'Kerala Backwaters Resort':
        mixData = {
          total: 420000,
          breakdown: [
            { category: 'Room Revenue', percentage: 60, amount: 252000, color: 'blue' },
            { category: 'F&B Revenue', percentage: 30, amount: 126000, color: 'green' },
            { category: 'Ayurveda & Spa', percentage: 8, amount: 33600, color: 'purple' },
            { category: 'Boat Tours', percentage: 2, amount: 8400, color: 'cyan' }
          ]
        };
        break;
        
      case 'Diu - Ghogla':
        mixData = {
          total: 380000,
          breakdown: [
            { category: 'Room Revenue', percentage: 55, amount: 209000, color: 'blue' },
            { category: 'F&B Revenue', percentage: 35, amount: 133000, color: 'green' },
            { category: 'Beach Activities', percentage: 7, amount: 26600, color: 'yellow' },
            { category: 'Water Sports', percentage: 3, amount: 11400, color: 'cyan' }
          ]
        };
        break;
        
      default:
        // Default data for unknown locations
        mixData = {
          total: 510000,
          breakdown: [
            { category: 'Room Revenue', percentage: 65, amount: 331500, color: 'blue' },
            { category: 'F&B Revenue', percentage: 25, amount: 127500, color: 'green' },
            { category: 'Spa & Others', percentage: 10, amount: 51000, color: 'yellow' }
          ]
        };
    }

    res.json({
      success: true,
      data: { mix: mixData }
    });
  } catch (error) {
    console.error('Get revenue mix error:', error);
    res.status(500).json({ message: 'Server error while fetching revenue mix' });
  }
};

module.exports = {
  getOperationalStats,
  getResortRevenue,
  getResortOccupancy,
  getRevPARPerformance,
  getRevenueBreakdown,
  getResortPerformance,
  getRevenueMix
};
