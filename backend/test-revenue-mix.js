const express = require('express');
const app = express();

// Mock the revenue mix function
const getRevenueMix = (location) => {
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
      mixData = {
        total: 510000,
        breakdown: [
          { category: 'Room Revenue', percentage: 65, amount: 331500, color: 'blue' },
          { category: 'F&B Revenue', percentage: 25, amount: 127500, color: 'green' },
          { category: 'Spa & Others', percentage: 10, amount: 51000, color: 'yellow' }
        ]
      };
  }
  
  return mixData;
};

// Test the function
console.log('Testing Revenue Mix Function...\n');

const locations = ['Goa Beach Resort', 'Kerala Backwaters Resort', 'Diu - Ghogla', 'Unknown Resort'];

locations.forEach(location => {
  console.log(`📍 Location: ${location}`);
  const data = getRevenueMix(location);
  console.log(`💰 Total Revenue: ₹${data.total.toLocaleString()}`);
  console.log('📊 Breakdown:');
  data.breakdown.forEach(item => {
    console.log(`   • ${item.category}: ${item.percentage}% (₹${item.amount.toLocaleString()})`);
  });
  console.log('');
});

console.log('✅ Revenue mix function test completed successfully!');
