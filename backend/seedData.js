const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Department = require('./models/Department');
const Location = require('./models/Location');
const Candidate = require('./models/Candidate');
const Comment = require('./models/Comment');
const DailyReport = require('./models/DailyReport');
const ExpenseReport = require('./models/ExpenseReport');

// Database connection
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('Connected to database. Starting seed process...');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Location.deleteMany({});
    await Candidate.deleteMany({});
    await Comment.deleteMany({});
    await DailyReport.deleteMany({});
    await ExpenseReport.deleteMany({});

    console.log('Cleared existing data');

    // Seed Departments
    const departments = await Department.insertMany([
      {
        name: 'Human Resources',
        description: 'HR department responsible for recruitment and employee management',
        status: 'Active'
      },
      {
        name: 'Operations',
        description: 'Operations department managing daily hotel operations',
        status: 'Active'
      },
      {
        name: 'Finance',
        description: 'Finance department handling financial operations',
        status: 'Active'
      },
      {
        name: 'Food & Beverage',
        description: 'F&B department managing restaurants and bars',
        status: 'Active'
      },
      {
        name: 'Housekeeping',
        description: 'Housekeeping department for room maintenance',
        status: 'Active'
      },
      {
        name: 'Front Office',
        description: 'Front office department for guest services',
        status: 'Active'
      },
      {
        name: 'Sales & Marketing',
        description: 'Sales and marketing department',
        status: 'Active'
      },
      {
        name: 'Engineering',
        description: 'Engineering department for maintenance',
        status: 'Active'
      }
    ]);

    console.log('Departments seeded');

    // Seed Locations
    const locations = await Location.insertMany([
      {
        name: 'Mumbai Resort',
        address: 'Juhu Beach, Mumbai, Maharashtra',
        status: 'Active'
      },
      {
        name: 'Goa Resort',
        address: 'Calangute Beach, Goa',
        status: 'Active'
      },
      {
        name: 'Kerala Resort',
        address: 'Kovalam Beach, Kerala',
        status: 'Active'
      },
      {
        name: 'Rajasthan Resort',
        address: 'Jaipur, Rajasthan',
        status: 'Active'
      },
      {
        name: 'Himachal Resort',
        address: 'Manali, Himachal Pradesh',
        status: 'Active'
      },
      {
        name: 'Corporate Office',
        address: 'Bandra Kurla Complex, Mumbai',
        status: 'Active'
      }
    ]);

    console.log('Locations seeded');

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        username: 'admin',
        email: 'admin@company.com',
        password: hashedPassword,
        role: 'MASTER',
        location: 'Corporate Office',
        status: 'Active'
      },
      {
        username: 'hr_admin',
        email: 'hr.admin@company.com',
        password: hashedPassword,
        role: 'HR Admin',
        location: 'Corporate Office',
        status: 'Active'
      },
      {
        username: 'cluster_manager',
        email: 'cluster.manager@company.com',
        password: hashedPassword,
        role: 'Cluster General Manager',
        location: 'Mumbai Resort',
        status: 'Active'
      },
      {
        username: 'ops_manager',
        email: 'ops.manager@company.com',
        password: hashedPassword,
        role: 'Operational Manager',
        location: 'Mumbai Resort',
        status: 'Active'
      },
      {
        username: 'hr_hod',
        email: 'hr.hod@company.com',
        password: hashedPassword,
        role: 'HOD',
        department: 'Human Resources',
        location: 'Corporate Office',
        status: 'Active'
      },
      {
        username: 'f&b_hod',
        email: 'f&b.hod@company.com',
        password: hashedPassword,
        role: 'HOD',
        department: 'Food & Beverage',
        location: 'Mumbai Resort',
        status: 'Active'
      },
      {
        username: 'housekeeping_hod',
        email: 'housekeeping.hod@company.com',
        password: hashedPassword,
        role: 'HOD',
        department: 'Housekeeping',
        location: 'Mumbai Resort',
        status: 'Active'
      },
      {
        username: 'frontoffice_hod',
        email: 'frontoffice.hod@company.com',
        password: hashedPassword,
        role: 'HOD',
        department: 'Front Office',
        location: 'Mumbai Resort',
        status: 'Active'
      }
    ]);

    console.log('Users seeded');

    // Seed Candidates
    const candidates = await Candidate.insertMany([
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91-9876543210',
        role: 'Front Office Manager',
        department: 'Front Office',
        location: 'Mumbai Resort',
        source: 'LinkedIn',
        status: 'Shortlisted',
        uploadedBy: users[1]._id, // HR Admin
        notes: 'Strong customer service background, 5 years experience in hospitality'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@email.com',
        phone: '+91-9876543211',
        role: 'Chef',
        department: 'Food & Beverage',
        location: 'Goa Resort',
        source: 'Indeed',
        status: 'Interview Scheduled',
        uploadedBy: users[1]._id,
        notes: 'Specializes in Indian cuisine, 8 years experience'
      },
      {
        name: 'Anita Patel',
        email: 'anita.patel@email.com',
        phone: '+91-9876543212',
        role: 'Housekeeping Supervisor',
        department: 'Housekeeping',
        location: 'Kerala Resort',
        source: 'Referral',
        status: 'Interview Done',
        uploadedBy: users[1]._id,
        notes: 'Excellent leadership skills, 6 years in housekeeping'
      },
      {
        name: 'Suresh Reddy',
        email: 'suresh.reddy@email.com',
        phone: '+91-9876543213',
        role: 'Sales Executive',
        department: 'Sales & Marketing',
        location: 'Rajasthan Resort',
        source: 'Naukri.com',
        status: 'Hired',
        uploadedBy: users[1]._id,
        notes: 'Strong sales track record, 4 years experience'
      },
      {
        name: 'Meera Singh',
        email: 'meera.singh@email.com',
        phone: '+91-9876543214',
        role: 'HR Coordinator',
        department: 'Human Resources',
        location: 'Corporate Office',
        source: 'LinkedIn',
        status: 'On Hold',
        uploadedBy: users[1]._id,
        notes: 'Good communication skills, 3 years HR experience'
      },
      {
        name: 'Vikram Malhotra',
        email: 'vikram.malhotra@email.com',
        phone: '+91-9876543215',
        role: 'Maintenance Engineer',
        department: 'Engineering',
        location: 'Himachal Resort',
        source: 'Company Website',
        status: 'Rejected',
        uploadedBy: users[1]._id,
        notes: 'Technical skills not up to mark'
      },
      {
        name: 'Sunita Verma',
        email: 'sunita.verma@email.com',
        phone: '+91-9876543216',
        role: 'Receptionist',
        department: 'Front Office',
        location: 'Mumbai Resort',
        source: 'Referral',
        status: 'Uploaded',
        uploadedBy: users[1]._id,
        notes: 'Fresh graduate, good communication skills'
      },
      {
        name: 'Arun Joshi',
        email: 'arun.joshi@email.com',
        phone: '+91-9876543217',
        role: 'Bartender',
        department: 'Food & Beverage',
        location: 'Goa Resort',
        source: 'Indeed',
        status: 'Interview Scheduled',
        uploadedBy: users[1]._id,
        notes: 'Experience with cocktails and wine service'
      }
    ]);

    console.log('Candidates seeded');

    // Seed Comments
    await Comment.insertMany([
      {
        candidateId: candidates[0]._id,
        author: 'HR Admin',
        content: 'Candidate has excellent communication skills and relevant experience.',
        authorId: users[1]._id
      },
      {
        candidateId: candidates[0]._id,
        author: 'HOD Front Office',
        content: 'Interview scheduled for next week. Will assess technical skills.',
        authorId: users[7]._id
      },
      {
        candidateId: candidates[1]._id,
        author: 'HR Admin',
        content: 'Strong culinary background. Need to verify certifications.',
        authorId: users[1]._id
      },
      {
        candidateId: candidates[2]._id,
        author: 'HOD Housekeeping',
        content: 'Interview completed successfully. Recommended for hire.',
        authorId: users[6]._id
      },
      {
        candidateId: candidates[3]._id,
        author: 'HR Admin',
        content: 'Offer letter sent. Expected joining date: 15th next month.',
        authorId: users[1]._id
      }
    ]);

    console.log('Comments seeded');

    // Seed Daily Reports
    const dailyReports = await DailyReport.insertMany([
      {
        resortName: 'Mumbai Resort',
        submittedBy: 'Operations Manager',
        reportDate: '2024-01-15',
        status: 'approved',
        roomsOccupied: 45,
        totalGuests: 78,
        occupancyRatio: 75.0,
        mtdOccupancy: 72.5,
        ytdOccupancy: 68.3,
        roomRevenue: 125000,
        fBRevenue: 45000,
        otherRevenue: 15000,
        totalRevenue: 185000,
        foodRevenue: 28000,
        beverageRevenue: 17000,
        totalFBRevenue: 45000,
        callCentreRooms: 12,
        callCentreRevenue: 36000,
        callCentreADR: 3000,
        travelAgentRooms: 8,
        travelAgentRevenue: 24000,
        travelAgentADR: 3000,
        otaRooms: 15,
        otaRevenue: 45000,
        otaADR: 3000,
        walkInRooms: 5,
        walkInRevenue: 15000,
        walkInADR: 3000,
        salesManagerRooms: 3,
        salesManagerRevenue: 9000,
        salesManagerADR: 3000,
        salesManagerName: 'Rajesh Kumar',
        clubMahindraRooms: 2,
        clubMahindraRevenue: 6000,
        clubMahindraADR: 3000,
        breakfastRevenue: 18000,
        breakfastGuests: 45,
        breakfastAverage: 400,
        lunchRevenue: 15000,
        lunchGuests: 35,
        lunchAverage: 428,
        dinnerRevenue: 25000,
        dinnerGuests: 50,
        dinnerAverage: 500,
        barRevenue: 8000,
        barGuests: 25,
        barAverage: 320,
        totalRoomRevenue: 125000,
        totalFBRevenue: 45000,
        additionalRevenue: 15000,
        spaRevenue: 5000,
        totalRevenueForDay: 190000
      },
      {
        resortName: 'Goa Resort',
        submittedBy: 'Operations Manager',
        reportDate: '2024-01-15',
        status: 'submitted',
        roomsOccupied: 38,
        totalGuests: 65,
        occupancyRatio: 63.3,
        mtdOccupancy: 65.2,
        ytdOccupancy: 62.1,
        roomRevenue: 95000,
        fBRevenue: 38000,
        otherRevenue: 12000,
        totalRevenue: 145000,
        foodRevenue: 22000,
        beverageRevenue: 16000,
        totalFBRevenue: 38000,
        callCentreRooms: 10,
        callCentreRevenue: 30000,
        callCentreADR: 3000,
        travelAgentRooms: 6,
        travelAgentRevenue: 18000,
        travelAgentADR: 3000,
        otaRooms: 12,
        otaRevenue: 36000,
        otaADR: 3000,
        walkInRooms: 4,
        walkInRevenue: 12000,
        walkInADR: 3000,
        salesManagerRooms: 2,
        salesManagerRevenue: 6000,
        salesManagerADR: 3000,
        salesManagerName: 'Priya Sharma',
        clubMahindraRooms: 1,
        clubMahindraRevenue: 3000,
        clubMahindraADR: 3000,
        breakfastRevenue: 15000,
        breakfastGuests: 38,
        breakfastAverage: 395,
        lunchRevenue: 12000,
        lunchGuests: 28,
        lunchAverage: 429,
        dinnerRevenue: 20000,
        dinnerGuests: 40,
        dinnerAverage: 500,
        barRevenue: 12000,
        barGuests: 30,
        barAverage: 400,
        totalRoomRevenue: 95000,
        totalFBRevenue: 38000,
        additionalRevenue: 12000,
        spaRevenue: 8000,
        totalRevenueForDay: 153000
      }
    ]);

    console.log('Daily Reports seeded');

    // Seed Expense Reports
    const expenseReports = await ExpenseReport.insertMany([
      {
        userId: users[3]._id, // Ops Manager
        hotelName: 'Mumbai Resort',
        reportDate: new Date('2024-01-15'),
        status: 'approved',
        storeAndPurchase: {
          totalPurchaseAmount: 25000,
          purchaseDetails: [
            {
              item: 'Fresh Vegetables',
              quantity: 50,
              unitPrice: 200,
              totalPrice: 10000,
              supplier: 'Fresh Foods Ltd',
              purchaseDate: new Date('2024-01-15')
            },
            {
              item: 'Cleaning Supplies',
              quantity: 20,
              unitPrice: 750,
              totalPrice: 15000,
              supplier: 'CleanPro Supplies',
              purchaseDate: new Date('2024-01-15')
            }
          ]
        },
        departmentBills: {
          totalBillsAmount: 15000,
          bills: [
            {
              department: 'Food & Beverage',
              billType: 'Electricity',
              amount: 8000,
              dueDate: new Date('2024-01-25'),
              status: 'pending',
              description: 'Monthly electricity bill for kitchen'
            },
            {
              department: 'Housekeeping',
              billType: 'Laundry',
              amount: 7000,
              dueDate: new Date('2024-01-20'),
              status: 'paid',
              description: 'Weekly laundry service'
            }
          ]
        },
        storeInventory: {
          totalInventoryValue: 75000,
          inventoryItems: [
            {
              itemName: 'Rice',
              category: 'Grains',
              quantity: 100,
              unitCost: 50,
              totalValue: 5000,
              reorderLevel: 20
            },
            {
              itemName: 'Cooking Oil',
              category: 'Oils',
              quantity: 50,
              unitCost: 200,
              totalValue: 10000,
              reorderLevel: 10
            },
            {
              itemName: 'Detergent',
              category: 'Cleaning',
              quantity: 30,
              unitCost: 500,
              totalValue: 15000,
              reorderLevel: 5
            }
          ]
        },
        powerConsumption: {
          totalPowerCost: 12000,
          consumptionDetails: [
            {
              meterReading: 5000,
              previousReading: 4800,
              unitsConsumed: 200,
              ratePerUnit: 8,
              totalCost: 1600,
              meterType: 'Main Meter',
              readingDate: new Date('2024-01-15')
            },
            {
              meterReading: 3000,
              previousReading: 2800,
              unitsConsumed: 200,
              ratePerUnit: 8,
              totalCost: 1600,
              meterType: 'Kitchen Meter',
              readingDate: new Date('2024-01-15')
            }
          ]
        },
        summary: {
          totalExpenses: 67000,
          totalRevenue: 190000,
          netProfit: 123000,
          profitMargin: 64.7,
          notes: 'Good performance this month with high occupancy'
        },
        control: {
          approvedBy: users[2]._id, // Cluster Manager
          approvedAt: new Date('2024-01-16'),
          approvalNotes: 'All expenses verified and approved',
          isLocked: true,
          lastModifiedBy: users[3]._id
        }
      },
      {
        userId: users[3]._id,
        hotelName: 'Goa Resort',
        reportDate: new Date('2024-01-15'),
        status: 'submitted',
        storeAndPurchase: {
          totalPurchaseAmount: 20000,
          purchaseDetails: [
            {
              item: 'Seafood',
              quantity: 30,
              unitPrice: 400,
              totalPrice: 12000,
              supplier: 'Ocean Fresh Ltd',
              purchaseDate: new Date('2024-01-15')
            },
            {
              item: 'Beverages',
              quantity: 25,
              unitPrice: 320,
              totalPrice: 8000,
              supplier: 'Beverage Co',
              purchaseDate: new Date('2024-01-15')
            }
          ]
        },
        departmentBills: {
          totalBillsAmount: 12000,
          bills: [
            {
              department: 'Food & Beverage',
              billType: 'Gas',
              amount: 6000,
              dueDate: new Date('2024-01-22'),
              status: 'pending',
              description: 'Monthly gas bill'
            },
            {
              department: 'Engineering',
              billType: 'Maintenance',
              amount: 6000,
              dueDate: new Date('2024-01-18'),
              status: 'pending',
              description: 'AC maintenance service'
            }
          ]
        },
        storeInventory: {
          totalInventoryValue: 60000,
          inventoryItems: [
            {
              itemName: 'Wheat Flour',
              category: 'Grains',
              quantity: 80,
              unitCost: 40,
              totalValue: 3200,
              reorderLevel: 15
            },
            {
              itemName: 'Coconut Oil',
              category: 'Oils',
              quantity: 40,
              unitCost: 180,
              totalValue: 7200,
              reorderLevel: 8
            }
          ]
        },
        powerConsumption: {
          totalPowerCost: 10000,
          consumptionDetails: [
            {
              meterReading: 4500,
              previousReading: 4300,
              unitsConsumed: 200,
              ratePerUnit: 8,
              totalCost: 1600,
              meterType: 'Main Meter',
              readingDate: new Date('2024-01-15')
            }
          ]
        },
        summary: {
          totalExpenses: 52000,
          totalRevenue: 153000,
          netProfit: 101000,
          profitMargin: 66.0,
          notes: 'Strong performance with good profit margins'
        },
        control: {
          lastModifiedBy: users[3]._id
        }
      }
    ]);

    console.log('Expense Reports seeded');

    console.log('✅ All seed data has been successfully created!');
    console.log(`📊 Summary:`);
    console.log(`   - ${departments.length} Departments`);
    console.log(`   - ${locations.length} Locations`);
    console.log(`   - ${users.length} Users`);
    console.log(`   - ${candidates.length} Candidates`);
    console.log(`   - ${dailyReports.length} Daily Reports`);
    console.log(`   - ${expenseReports.length} Expense Reports`);

    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();

