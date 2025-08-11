const { connectDB, sequelize } = require('../config/database');
const User = require('./User');
const Trip = require('./Trip');
const Activity = require('./Activity');
const Expense = require('./Expense');
const VendorService = require('./VendorService');

// Define associations
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Trip.hasMany(Activity, { foreignKey: 'tripId', as: 'activities' });
Activity.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

Trip.hasMany(Expense, { foreignKey: 'tripId', as: 'expenses' });
Expense.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });

// Initialize database connection and create default admin
const initializeDatabase = async () => {
  try {
    await connectDB();
    await createDefaultAdmin();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      where: { email: 'admin@globetrotter.com' }
    });

    if (!adminExists) {
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@globetrotter.com',
        password: 'admin123',
        role: 'admin',
        isVerified: true,
        country: 'Global',
        city: 'Headquarters'
      });

      console.log('✅ Default admin user created');
    } else {
      console.log('✅ Default admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

module.exports = {
  User,
  Trip,
  Activity,
  Expense,
  VendorService,
  sequelize,
  initializeDatabase,
  createDefaultAdmin
};
