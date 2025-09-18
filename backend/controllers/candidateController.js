const Candidate = require('../models/Candidate');
const path = require('path');
const fs = require('fs');

// @desc    Get single candidate
// @route   GET /api/candidates/:id
// @access  Private
const getCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id)
      .populate('uploadedBy', 'username');

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({
      success: true,
      candidate
    });
  } catch (error) {
    console.error('Get candidate error:', error);
    res.status(500).json({ message: 'Server error while fetching candidate' });
  }
};

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
const getCandidates = async (req, res) => {
  try {
    const { department, location, status, search, dateRange } = req.query;
    let query = {};

    // Apply filters
    if (department && department !== 'All Departments') {
      query.department = department;
    }
    if (location && location !== 'All Locations') {
      query.location = location;
    }
    if (status && status !== 'All Statuses') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (dateRange && dateRange !== 'All') {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case 'Last 7 days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 30 days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 90 days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'Last year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    const candidates = await Candidate.find(query)
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: candidates.length,
      candidates
    });
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ message: 'Server error while fetching candidates' });
  }
};

// @desc    Create new candidate
// @route   POST /api/candidates
// @access  Private
const createCandidate = async (req, res) => {
  try {
    const { name, email, phone, role, department, location, source, notes } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !role || !department || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if candidate already exists
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ message: 'Candidate with this email already exists' });
    }

    // Create candidate
    const candidate = new Candidate({
      name,
      email,
      phone,
      role,
      department,
      location,
      source: source || '',
      notes: notes || '',
      uploadedBy: req.user._id,
      cvPath: req.file ? req.file.path : null
    });

    await candidate.save();

    const populatedCandidate = await Candidate.findById(candidate._id)
      .populate('uploadedBy', 'username');

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      candidate: populatedCandidate
    });
  } catch (error) {
    console.error('Create candidate error:', error);
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
    
    if (error.message && error.message.includes('files are allowed')) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Server error while creating candidate' });
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private
const updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, department, location, source, status, notes } = req.body;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Update fields
    if (name) candidate.name = name;
    if (email) candidate.email = email;
    if (phone) candidate.phone = phone;
    if (role) candidate.role = role;
    if (department) candidate.department = department;
    if (location) candidate.location = location;
    if (source !== undefined) candidate.source = source;
    if (status) candidate.status = status;
    if (notes !== undefined) candidate.notes = notes;

    // Update CV if new file uploaded
    if (req.file) {
      // Delete old CV file if exists
      if (candidate.cvPath && fs.existsSync(candidate.cvPath)) {
        fs.unlinkSync(candidate.cvPath);
      }
      candidate.cvPath = req.file.path;
    }

    await candidate.save();

    const populatedCandidate = await Candidate.findById(candidate._id)
      .populate('uploadedBy', 'username');

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      candidate: populatedCandidate
    });
  } catch (error) {
    console.error('Update candidate error:', error);
    res.status(500).json({ message: 'Server error while updating candidate' });
  }
};

// @desc    Delete candidate
// @route   DELETE /api/candidates/:id
// @access  Private (Master only)
const deleteCandidate = async (req, res) => {
  try {
    // Check if user has Master role
    if (req.user.role !== 'MASTER') {
      return res.status(403).json({ message: 'Access denied. Master privileges required to delete candidates.' });
    }

    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Delete CV file if exists
    if (candidate.cvPath && fs.existsSync(candidate.cvPath)) {
      fs.unlinkSync(candidate.cvPath);
    }

    await Candidate.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('Delete candidate error:', error);
    res.status(500).json({ message: 'Server error while deleting candidate' });
  }
};

// @desc    Download candidate CV
// @route   GET /api/candidates/:id/download-cv
// @access  Private
const downloadCV = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    if (!candidate.cvPath || !fs.existsSync(candidate.cvPath)) {
      return res.status(404).json({ message: 'CV file not found' });
    }

    const fileName = `${candidate.name}_CV${path.extname(candidate.cvPath)}`;
    res.download(candidate.cvPath, fileName);
  } catch (error) {
    console.error('Download CV error:', error);
    res.status(500).json({ message: 'Server error while downloading CV' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/candidates/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const { department, location, dateRange } = req.query;
    let query = {};

    // Apply filters
    if (department && department !== 'All Departments') {
      query.department = department;
    }
    if (location && location !== 'All Locations') {
      query.location = location;
    }

    // Date range filter
    if (dateRange && dateRange !== 'All') {
      const now = new Date();
      let startDate;

      switch (dateRange) {
        case 'Last 7 days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 30 days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 90 days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'Last year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    const totalCVs = await Candidate.countDocuments(query);
    const hired = await Candidate.countDocuments({ ...query, status: 'Hired' });
    const interviewed = await Candidate.countDocuments({ 
      ...query, 
      status: { $in: ['Interview Done', 'Interview Scheduled'] } 
    });
    const rejected = await Candidate.countDocuments({ ...query, status: 'Rejected' });
    const onHold = await Candidate.countDocuments({ ...query, status: 'On Hold' });

    // Get candidates by department
    const candidatesByDepartment = await Candidate.aggregate([
      { $match: query },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get candidates by location
    const candidatesByLocation = await Candidate.aggregate([
      { $match: query },
      { $group: { _id: '$location', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalCVs,
        hired,
        interviewed,
        rejected,
        onHold,
        candidatesByDepartment,
        candidatesByLocation
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard statistics' });
  }
};

module.exports = {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  downloadCV,
  getDashboardStats
};

