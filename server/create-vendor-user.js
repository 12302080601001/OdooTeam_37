const bcrypt = require('bcryptjs');
const { User } = require('./models');

async function createVendorUser() {
  try {
    // Check if vendor user already exists
    const existingVendor = await User.findOne({ 
      where: { email: 'vendor@test.com' } 
    });

    if (existingVendor) {
      console.log('✅ Vendor user already exists!');
      console.log('📧 Email: vendor@test.com');
      console.log('🔑 Password: vendor123');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('vendor123', 10);

    // Create vendor user
    const vendorUser = await User.create({
      firstName: 'Test',
      lastName: 'Vendor',
      email: 'vendor@test.com',
      password: hashedPassword,
      role: 'vendor',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Vendor user created successfully!');
    console.log('📧 Email: vendor@test.com');
    console.log('🔑 Password: vendor123');
    console.log('👤 Role: vendor');
    console.log('🆔 User ID:', vendorUser.id);

    // Also create a traveller user for testing
    const existingTraveller = await User.findOne({ 
      where: { email: 'user@test.com' } 
    });

    if (!existingTraveller) {
      const travellerPassword = await bcrypt.hash('user123', 10);
      
      const travellerUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'user@test.com',
        password: travellerPassword,
        role: 'traveller',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Traveller user created successfully!');
      console.log('📧 Email: user@test.com');
      console.log('🔑 Password: user123');
      console.log('👤 Role: traveller');
      console.log('🆔 User ID:', travellerUser.id);
    }

    // Create admin user
    const existingAdmin = await User.findOne({ 
      where: { email: 'admin@test.com' } 
    });

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = await User.create({
        firstName: 'Test',
        lastName: 'Admin',
        email: 'admin@test.com',
        password: adminPassword,
        role: 'admin',
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@test.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
      console.log('🆔 User ID:', adminUser.id);
    }

    console.log('\n🎉 All test users are ready!');
    console.log('\n📝 Login Credentials:');
    console.log('Vendor: vendor@test.com / vendor123');
    console.log('User: user@test.com / user123');
    console.log('Admin: admin@test.com / admin123');

  } catch (error) {
    console.error('❌ Error creating users:', error);
  }
}

// Run the function
createVendorUser();
