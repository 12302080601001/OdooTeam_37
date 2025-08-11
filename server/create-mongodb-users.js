const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['traveller', 'admin', 'planner', 'vendor'], 
    default: 'traveller' 
  },
  isEmailVerified: { type: Boolean, default: false },
  profilePicture: String,
  bio: String,
  location: String,
  preferences: {
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function createTestUsers() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/globetrotter_db';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create Vendor User
    const existingVendor = await User.findOne({ email: 'vendor@test.com' });
    if (!existingVendor) {
      const hashedPassword = await bcrypt.hash('vendor123', 10);
      
      const vendorUser = new User({
        firstName: 'Test',
        lastName: 'Vendor',
        email: 'vendor@test.com',
        password: hashedPassword,
        role: 'vendor',
        isEmailVerified: true,
        bio: 'Test vendor account for development',
        location: 'New York, USA'
      });

      await vendorUser.save();
      console.log('✅ Vendor user created successfully!');
      console.log('📧 Email: vendor@test.com');
      console.log('🔑 Password: vendor123');
      console.log('👤 Role: vendor');
    } else {
      console.log('✅ Vendor user already exists!');
    }

    // Create Traveller User
    const existingTraveller = await User.findOne({ email: 'user@test.com' });
    if (!existingTraveller) {
      const hashedPassword = await bcrypt.hash('user123', 10);
      
      const travellerUser = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'traveller',
        isEmailVerified: true,
        bio: 'Test traveller account for development',
        location: 'Los Angeles, USA'
      });

      await travellerUser.save();
      console.log('✅ Traveller user created successfully!');
      console.log('📧 Email: user@test.com');
      console.log('🔑 Password: user123');
      console.log('👤 Role: traveller');
    } else {
      console.log('✅ Traveller user already exists!');
    }

    // Create Admin User
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = new User({
        firstName: 'Test',
        lastName: 'Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        isEmailVerified: true,
        bio: 'Test admin account for development',
        location: 'San Francisco, USA'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@test.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
    } else {
      console.log('✅ Admin user already exists!');
    }

    // Create Planner User
    const existingPlanner = await User.findOne({ email: 'planner@test.com' });
    if (!existingPlanner) {
      const hashedPassword = await bcrypt.hash('planner123', 10);
      
      const plannerUser = new User({
        firstName: 'Test',
        lastName: 'Planner',
        email: 'planner@test.com',
        password: hashedPassword,
        role: 'planner',
        isEmailVerified: true,
        bio: 'Test planner account for development',
        location: 'Chicago, USA'
      });

      await plannerUser.save();
      console.log('✅ Planner user created successfully!');
      console.log('📧 Email: planner@test.com');
      console.log('🔑 Password: planner123');
      console.log('👤 Role: planner');
    } else {
      console.log('✅ Planner user already exists!');
    }

    console.log('\n🎉 All test users are ready!');
    console.log('\n📝 Login Credentials:');
    console.log('Vendor: vendor@test.com / vendor123');
    console.log('Traveller: user@test.com / user123');
    console.log('Admin: admin@test.com / admin123');
    console.log('Planner: planner@test.com / planner123');

    // Close connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');

  } catch (error) {
    console.error('❌ Error creating users:', error);
    process.exit(1);
  }
}

// Run the function
createTestUsers();
