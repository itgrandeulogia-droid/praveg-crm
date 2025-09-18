# Database Seed Data

This document provides information about the seed data for the HR Recruitment System database.

## Overview

The seed data includes realistic sample data for all major entities in the system:

- **Users** - Different user roles with login credentials
- **Departments** - Hotel departments
- **Locations** - Resort locations
- **Candidates** - Job applicants with various statuses
- **Comments** - Comments on candidates
- **Daily Reports** - Hotel operational reports
- **Expense Reports** - Financial reports

## How to Run Seed Data

### Prerequisites
1. Make sure MongoDB is running
2. Ensure your `.env` file has the correct `MONGODB_URI`
3. Install dependencies: `npm install`

### Running the Seed Script

```bash
# Navigate to backend directory
cd hr-recruitment-system/backend

# Run the seed script
npm run seed
```

Or run directly:
```bash
node seedData.js
```

## Seed Data Details

### Users Created

| Username | Email | Role | Password |
|----------|-------|------|----------|
| admin | admin@company.com | MASTER | password123 |
| hr_admin | hr.admin@company.com | HR Admin | password123 |
| cluster_manager | cluster.manager@company.com | Cluster General Manager | password123 |
| ops_manager | ops.manager@company.com | Operational Manager | password123 |
| hr_hod | hr.hod@company.com | HOD (HR) | password123 |
| f&b_hod | f&b.hod@company.com | HOD (F&B) | password123 |
| housekeeping_hod | housekeeping.hod@company.com | HOD (Housekeeping) | password123 |
| frontoffice_hod | frontoffice.hod@company.com | HOD (Front Office) | password123 |

### Departments Created
- Human Resources
- Operations
- Finance
- Food & Beverage
- Housekeeping
- Front Office
- Sales & Marketing
- Engineering

### Locations Created
- Mumbai Resort
- Goa Resort
- Kerala Resort
- Rajasthan Resort
- Himachal Resort
- Corporate Office

### Candidates Created
8 candidates with various statuses:
- Uploaded
- Shortlisted
- Interview Scheduled
- Interview Done
- Hired
- Rejected
- On Hold

### Sample Data Includes
- **Daily Reports**: 2 sample reports for Mumbai and Goa resorts
- **Expense Reports**: 2 sample reports with detailed financial data
- **Comments**: Sample comments on candidates from different users

## Data Relationships

The seed data maintains proper relationships:
- Candidates are linked to users who uploaded them
- Comments are linked to candidates and users
- Expense reports are linked to users
- Users have appropriate departments and locations

## Important Notes

1. **Password**: All users have the same password: `password123`
2. **Data Clearing**: The script clears all existing data before seeding
3. **Realistic Data**: All data is realistic and follows proper business logic
4. **Timestamps**: All records include proper timestamps

## Customization

To modify the seed data:
1. Edit the `seedData.js` file
2. Modify the data arrays as needed
3. Run the seed script again

## Troubleshooting

If you encounter issues:

1. **Database Connection**: Ensure MongoDB is running and accessible
2. **Environment Variables**: Check your `.env` file has correct `MONGODB_URI`
3. **Dependencies**: Run `npm install` to ensure all packages are installed
4. **Permissions**: Ensure you have write permissions to the database

## Sample Login

After running the seed script, you can login with:
- **Username**: admin
- **Password**: password123
- **Role**: MASTER (has access to all features)
