/**
 * Admin User Initialization Script
 * 
 * This script creates a default admin user in the database if none exists.
 * Run this script once to set up the initial admin account.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

// Default admin credentials - CHANGE IN PRODUCTION!
const defaultAdmin = {
  name: 'Admin User',
  email: 'dexter199057@gmail.com',
  password: 'qwer1234'
};

async function initializeAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for admin initialization');
    
    // Check if any admin user exists
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Initialization skipped.');
    } else {
      // Create new admin user
      const newAdmin = new User(defaultAdmin);
      await newAdmin.save();
      console.log('✅ Default admin user created successfully:');
      console.log(`   Email: ${defaultAdmin.email}`);
      console.log(`   Password: ${defaultAdmin.password}`);
      console.log('   Please change these credentials after first login!');
    }
  } catch (err) {
    console.error('❌ Admin initialization error:', err);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the initialization function
initializeAdmin().catch(console.error); 