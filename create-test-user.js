const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['traveller', 'admin', 'planner', 'vendor'], default: 'traveller' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  country: String,
  city: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createTestUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB');

    // Create test users
    const testUsers = [
      {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@test.com',
        password: '$2a$12$LQv3c1yqBwEHxv68fVFoSuKyTDHHkmcV9QvgpnwU.2HSLhQKinNJy', // password: test123
        role: 'traveller',
        isActive: true,
        isVerified: true,
        country: 'India',
        city: 'Mumbai'
      },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@test.com',
        password: '$2a$12$LQv3c1yqBwEHxv68fVFoSuKyTDHHkmcV9QvgpnwU.2HSLhQKinNJy', // password: test123
        role: 'admin',
        isActive: true,
        isVerified: true,
        country: 'India',
        city: 'Delhi'
      }
    ];

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        console.log(`✅ User already exists: ${userData.email}`);
      }
    }

    console.log('\n📝 Test Login Credentials:');
    console.log('Email: test@test.com');
    console.log('Password: test123');
    console.log('\n📝 Admin Login Credentials:');
    console.log('Email: admin@test.com');
    console.log('Password: test123');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestUsers();
