#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌍 GlobeTrotter Installation Script');
console.log('=====================================\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log('✅ Node.js version check passed');

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('cd client && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('✅ Created uploads directory');
}

// Check if .env file exists
const envFile = path.join(__dirname, '.env');
if (!fs.existsSync(envFile)) {
  console.log('\n⚠️  .env file not found');
  console.log('Please create a .env file with your database configuration');
  console.log('You can use the existing .env file as a template');
} else {
  console.log('✅ Environment file found');
}

console.log('\n🎉 Installation completed successfully!');
console.log('\nNext steps:');
console.log('1. Configure your .env file with database credentials');
console.log('2. Create MySQL database: CREATE DATABASE globetrotter_db;');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000');
console.log('\nDefault admin login:');
console.log('Email: admin@globetrotter.com');
console.log('Password: admin123');
console.log('\nHappy traveling! 🚀');
