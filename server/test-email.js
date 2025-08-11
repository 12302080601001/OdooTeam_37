const { sendWelcomeEmail, sendLoginAlert, transporter } = require('./services/emailService');
require('dotenv').config();

// Test email service
const testEmailService = async () => {
  console.log('🧪 Testing Email Service Configuration...\n');

  // Test 1: Check environment variables
  console.log('1. Checking environment variables:');
  console.log(`   EMAIL_HOST: ${process.env.EMAIL_HOST}`);
  console.log(`   EMAIL_PORT: ${process.env.EMAIL_PORT}`);
  console.log(`   MAIL_USERNAME: ${process.env.MAIL_USERNAME ? '✅ Set' : '❌ Missing'}`);
  console.log(`   MAIL_PASSWORD: ${process.env.MAIL_PASSWORD ? '✅ Set' : '❌ Missing'}`);
  console.log(`   MAIL_DEFAULT_SENDER: ${process.env.MAIL_DEFAULT_SENDER}`);
  console.log(`   CLIENT_URL: ${process.env.CLIENT_URL}\n`);

  // Test 2: Verify SMTP connection
  console.log('2. Testing SMTP connection...');
  try {
    await transporter.verify();
    console.log('✅ SMTP connection successful\n');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error.message);
    console.error('   Please check your email credentials and settings\n');
    return;
  }

  // Test 3: Send test welcome email
  console.log('3. Testing welcome email...');
  const testUser = {
    firstName: 'Test',
    lastName: 'User',
    email: process.env.MAIL_DEFAULT_SENDER // Send to yourself for testing
  };

  try {
    await sendWelcomeEmail(testUser);
    console.log('✅ Welcome email sent successfully\n');
  } catch (error) {
    console.error('❌ Welcome email failed:', error.message);
  }

  // Test 4: Send test login alert
  console.log('4. Testing login alert email...');
  try {
    await sendLoginAlert(testUser, { location: 'Test Location' });
    console.log('✅ Login alert email sent successfully\n');
  } catch (error) {
    console.error('❌ Login alert email failed:', error.message);
  }

  console.log('🎉 Email service test completed!');
  console.log('Check your email inbox for the test messages.');
  process.exit(0);
};

// Run the test
testEmailService().catch(error => {
  console.error('❌ Email service test failed:', error);
  process.exit(1);
});
