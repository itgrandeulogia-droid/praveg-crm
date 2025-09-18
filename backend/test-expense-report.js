const mongoose = require('mongoose');
const ExpenseReport = require('./models/ExpenseReport');

// Connect to MongoDB (you'll need to set up your connection string)
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/hr-recruitment', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test expense report creation
const testExpenseReport = async () => {
  try {
    // Create a test expense report
    const testReport = new ExpenseReport({
      userId: new mongoose.Types.ObjectId(), // Mock user ID
      hotelName: 'Test Hotel',
      reportDate: new Date(),
      storeAndPurchase: {
        purchaseDetails: [
          {
            item: 'Test Item',
            quantity: 10,
            unitPrice: 25.50,
            totalPrice: 255.00,
            supplier: 'Test Supplier',
            purchaseDate: new Date()
          }
        ]
      },
      departmentBills: {
        bills: [
          {
            department: 'Test Department',
            billType: 'Test Bill',
            amount: 500.00,
            dueDate: new Date(),
            status: 'pending',
            description: 'Test bill description'
          }
        ]
      },
      storeInventory: {
        inventoryItems: [
          {
            itemName: 'Test Inventory Item',
            category: 'Test Category',
            quantity: 100,
            unitCost: 15.00,
            totalValue: 1500.00,
            reorderLevel: 20
          }
        ]
      },
      powerConsumption: {
        consumptionDetails: [
          {
            meterReading: 10000,
            previousReading: 9500,
            unitsConsumed: 500,
            ratePerUnit: 8.00,
            totalCost: 4000.00,
            meterType: 'Test Meter',
            readingDate: new Date()
          }
        ]
      },
      summary: {
        totalRevenue: 10000.00,
        notes: 'Test expense report'
      }
    });

    // Save the report
    const savedReport = await testReport.save();
    console.log('✅ Expense report created successfully!');
    console.log('Report ID:', savedReport._id);
    console.log('Total Expenses:', savedReport.summary.totalExpenses);
    console.log('Net Profit:', savedReport.summary.netProfit);
    console.log('Profit Margin:', savedReport.summary.profitMargin + '%');

    // Test finding the report
    const foundReport = await ExpenseReport.findById(savedReport._id);
    console.log('✅ Report retrieved successfully!');
    console.log('Hotel Name:', foundReport.hotelName);
    console.log('Status:', foundReport.status);

    // Clean up - delete the test report
    await ExpenseReport.findByIdAndDelete(savedReport._id);
    console.log('✅ Test report cleaned up successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the test
const runTest = async () => {
  await connectDB();
  await testExpenseReport();
};

// Only run if this file is executed directly
if (require.main === module) {
  runTest().catch(console.error);
}

module.exports = { testExpenseReport };
