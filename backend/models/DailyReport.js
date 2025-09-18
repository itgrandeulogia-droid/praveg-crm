const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
  // Report metadata
  resortName: {
    type: String,
    required: true,
    trim: true
  },
  submittedBy: {
    type: String,
    required: true,
    trim: true
  },
  reportDate: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'approved', 'rejected'],
    default: 'draft'
  },

  // Occupancy data
  roomsOccupied: {
    type: Number,
    default: 0
  },
  totalGuests: {
    type: Number,
    default: 0
  },
  occupancyRatio: {
    type: Number,
    default: 0
  },
  mtdOccupancy: {
    type: Number,
    default: 0
  },
  ytdOccupancy: {
    type: Number,
    default: 0
  },

  // Revenue data
  roomRevenue: {
    type: Number,
    default: 0
  },
  fBRevenue: {
    type: Number,
    default: 0
  },
  otherRevenue: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  foodRevenue: {
    type: Number,
    default: 0
  },
  beverageRevenue: {
    type: Number,
    default: 0
  },
  totalFBRevenue: {
    type: Number,
    default: 0
  },

  // Revenue sources
  callCentreRooms: {
    type: Number,
    default: 0
  },
  callCentreRevenue: {
    type: Number,
    default: 0
  },
  callCentreADR: {
    type: Number,
    default: 0
  },
  travelAgentRooms: {
    type: Number,
    default: 0
  },
  travelAgentRevenue: {
    type: Number,
    default: 0
  },
  travelAgentADR: {
    type: Number,
    default: 0
  },
  otaRooms: {
    type: Number,
    default: 0
  },
  otaRevenue: {
    type: Number,
    default: 0
  },
  otaADR: {
    type: Number,
    default: 0
  },
  walkInRooms: {
    type: Number,
    default: 0
  },
  walkInRevenue: {
    type: Number,
    default: 0
  },
  walkInADR: {
    type: Number,
    default: 0
  },
  salesManagerRooms: {
    type: Number,
    default: 0
  },
  salesManagerRevenue: {
    type: Number,
    default: 0
  },
  salesManagerADR: {
    type: Number,
    default: 0
  },
  salesManagerName: {
    type: String,
    trim: true
  },
  clubMahindraRooms: {
    type: Number,
    default: 0
  },
  clubMahindraRevenue: {
    type: Number,
    default: 0
  },
  clubMahindraADR: {
    type: Number,
    default: 0
  },
  ncRooms: {
    type: Number,
    default: 0
  },
  ncGuestName: {
    type: String,
    trim: true
  },
  ncReference: {
    type: String,
    trim: true
  },

  // F&B Revenue
  breakfastRevenue: {
    type: Number,
    default: 0
  },
  breakfastGuests: {
    type: Number,
    default: 0
  },
  breakfastAverage: {
    type: Number,
    default: 0
  },
  lunchRevenue: {
    type: Number,
    default: 0
  },
  lunchGuests: {
    type: Number,
    default: 0
  },
  lunchAverage: {
    type: Number,
    default: 0
  },
  dinnerRevenue: {
    type: Number,
    default: 0
  },
  dinnerGuests: {
    type: Number,
    default: 0
  },
  dinnerAverage: {
    type: Number,
    default: 0
  },
  barRevenue: {
    type: Number,
    default: 0
  },
  barGuests: {
    type: Number,
    default: 0
  },
  barAverage: {
    type: Number,
    default: 0
  },

  // Summary
  totalRoomRevenue: {
    type: Number,
    default: 0
  },
  totalFBRevenue: {
    type: Number,
    default: 0
  },
  additionalRevenue: {
    type: Number,
    default: 0
  },
  spaRevenue: {
    type: Number,
    default: 0
  },
  totalRevenueForDay: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DailyReport', dailyReportSchema);
