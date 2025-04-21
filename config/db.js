// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Ensure MONGODB_URI is loaded from .env
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable not set.');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    // Exit process with failure in production environments
    if (process.env.NODE_ENV === 'production') {
      console.error('Exiting application due to database connection failure.');
      process.exit(1);
    }
  }
};

module.exports = connectDB; 