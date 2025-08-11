const { Sequelize } = require('sequelize');
require('dotenv').config();

// MySQL connection using Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'globetrotter_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Mkbharvad@8080',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: false
    }
  }
);

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
