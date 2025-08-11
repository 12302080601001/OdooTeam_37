const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection using Mongoose
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    const mongoURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/globetrotter_db';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📍 Database: ${mongoose.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed through app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Test database connection
const testConnection = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB connection is active');
      return true;
    } else {
      console.log('⚠️ MongoDB connection is not active');
      return false;
    }
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    return false;
  }
};

module.exports = {
  connectDB,
  testConnection,
  mongoose
};
