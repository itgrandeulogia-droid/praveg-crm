const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getCandidates,
  getCandidate,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  downloadCV,
  getDashboardStats
} = require('../controllers/candidateController');

const {
  getComments,
  addComment,
  deleteComment
} = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept PDF, DOC, and DOCX files
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @route   GET /api/candidates/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', authMiddleware, getDashboardStats);

// @route   GET /api/candidates
// @desc    Get all candidates
// @access  Private
router.get('/', authMiddleware, getCandidates);

// @route   GET /api/candidates/:id
// @desc    Get single candidate
// @access  Private
router.get('/:id', authMiddleware, getCandidate);

// @route   POST /api/candidates
// @desc    Create new candidate
// @access  Private
router.post('/', authMiddleware, upload.single('cv'), (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}, createCandidate);

// @route   PUT /api/candidates/:id
// @desc    Update candidate
// @access  Private
router.put('/:id', authMiddleware, upload.single('cv'), (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
    }
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
}, updateCandidate);

// @route   DELETE /api/candidates/:id
// @desc    Delete candidate
// @access  Private
router.delete('/:id', authMiddleware, deleteCandidate);

// @route   GET /api/candidates/:id/download-cv
// @desc    Download candidate CV
// @access  Private
router.get('/:id/download-cv', authMiddleware, downloadCV);

// Comment routes
// @route   GET /api/candidates/:id/comments
// @desc    Get comments for a candidate
// @access  Private
router.get('/:id/comments', authMiddleware, getComments);

// @route   POST /api/candidates/:id/comments
// @desc    Add a comment to a candidate
// @access  Private
router.post('/:id/comments', authMiddleware, addComment);

// @route   DELETE /api/candidates/:id/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:id/comments/:commentId', authMiddleware, deleteComment);

module.exports = router;

