const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Uploaded', 'Shortlisted', 'Interview Scheduled', 'Interview Done', 'Hired', 'Rejected', 'On Hold'],
    default: 'Uploaded'
  },
  cvPath: {
    type: String,
    default: null
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for better search performance
candidateSchema.index({ name: 'text', email: 'text', role: 'text' });

module.exports = mongoose.model('Candidate', candidateSchema);

