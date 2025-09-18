const mongoose = require('mongoose');

const expenseReportSchema = new mongoose.Schema({
  // Report metadata
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotelName: {
    type: String,
    required: true,
    trim: true
  },
  reportDate: {
    type: Date,
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

  // Store and Purchase
  storeAndPurchase: {
    totalPurchaseAmount: {
      type: Number,
      default: 0
    },
    purchaseDetails: [{
      item: {
        type: String,
        trim: true
      },
      quantity: {
        type: Number,
        default: 0
      },
      unitPrice: {
        type: Number,
        default: 0
      },
      totalPrice: {
        type: Number,
        default: 0
      },
      supplier: {
        type: String,
        trim: true
      },
      purchaseDate: {
        type: Date
      }
    }]
  },

  // Department Bills
  departmentBills: {
    totalBillsAmount: {
      type: Number,
      default: 0
    },
    bills: [{
      department: {
        type: String,
        trim: true
      },
      billType: {
        type: String,
        trim: true
      },
      amount: {
        type: Number,
        default: 0
      },
      dueDate: {
        type: Date
      },
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
      },
      description: {
        type: String,
        trim: true
      }
    }]
  },

  // Store Inventory
  storeInventory: {
    totalInventoryValue: {
      type: Number,
      default: 0
    },
    inventoryItems: [{
      itemName: {
        type: String,
        trim: true
      },
      category: {
        type: String,
        trim: true
      },
      quantity: {
        type: Number,
        default: 0
      },
      unitCost: {
        type: Number,
        default: 0
      },
      totalValue: {
        type: Number,
        default: 0
      },
      reorderLevel: {
        type: Number,
        default: 0
      },
      lastUpdated: {
        type: Date,
        default: Date.now
      }
    }]
  },

  // Power Consumption
  powerConsumption: {
    totalPowerCost: {
      type: Number,
      default: 0
    },
    consumptionDetails: [{
      meterReading: {
        type: Number,
        default: 0
      },
      previousReading: {
        type: Number,
        default: 0
      },
      unitsConsumed: {
        type: Number,
        default: 0
      },
      ratePerUnit: {
        type: Number,
        default: 0
      },
      totalCost: {
        type: Number,
        default: 0
      },
      meterType: {
        type: String,
        trim: true
      },
      readingDate: {
        type: Date
      }
    }]
  },

  // Summary
  summary: {
    totalExpenses: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    netProfit: {
      type: Number,
      default: 0
    },
    profitMargin: {
      type: Number,
      default: 0
    },
    notes: {
      type: String,
      trim: true
    }
  },

  // Control
  control: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: {
      type: Date
    },
    approvalNotes: {
      type: String,
      trim: true
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    lastModifiedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Calculate totals before saving
expenseReportSchema.pre('save', function(next) {
  // Calculate store and purchase total
  this.storeAndPurchase.totalPurchaseAmount = this.storeAndPurchase.purchaseDetails.reduce((sum, item) => {
    return sum + (item.totalPrice || 0);
  }, 0);

  // Calculate department bills total
  this.departmentBills.totalBillsAmount = this.departmentBills.bills.reduce((sum, bill) => {
    return sum + (bill.amount || 0);
  }, 0);

  // Calculate store inventory total
  this.storeInventory.totalInventoryValue = this.storeInventory.inventoryItems.reduce((sum, item) => {
    return sum + (item.totalValue || 0);
  }, 0);

  // Calculate power consumption total
  this.powerConsumption.totalPowerCost = this.powerConsumption.consumptionDetails.reduce((sum, consumption) => {
    return sum + (consumption.totalCost || 0);
  }, 0);

  // Calculate summary totals
  this.summary.totalExpenses = 
    (this.storeAndPurchase.totalPurchaseAmount || 0) +
    (this.departmentBills.totalBillsAmount || 0) +
    (this.powerConsumption.totalPowerCost || 0);

  // Calculate net profit and profit margin
  this.summary.netProfit = (this.summary.totalRevenue || 0) - (this.summary.totalExpenses || 0);
  this.summary.profitMargin = this.summary.totalRevenue > 0 ? 
    ((this.summary.netProfit / this.summary.totalRevenue) * 100) : 0;

  next();
});

module.exports = mongoose.model('ExpenseReport', expenseReportSchema);
