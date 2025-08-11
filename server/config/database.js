const { Sequelize } = require('sequelize');
require('dotenv').config();

// SQLite connection for local development
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database/globetrotter.db',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: false
  }
});

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully');

    // Sync database (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized');

    return sequelize;
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    process.exit(1);
  }
};

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection test successful.');
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
  }
};

module.exports = { connectDB, testConnection, sequelize };
