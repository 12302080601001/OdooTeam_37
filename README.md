<<<<<<< HEAD
# 🌍 GlobeTrotter - World-Class Travel Planning Platform

A comprehensive travel planning platform with multiple role-based dashboards built with React.js, Node.js, Bootstrap, and MySQL.

## 🚀 Features

### 👤 User Roles & Dashboards
- **Traveller Dashboard**: Plan trips, manage budgets, share itineraries
- **Admin Dashboard**: Platform monitoring, analytics, user moderation
- **Travel Planner Dashboard**: Create public itineraries, track engagement
- **Vendor Dashboard**: Manage services, bookings, and revenue

### ✨ Key Features
- 🗺️ Interactive trip planning with AI optimization
- 💰 Budget management and cost breakdown
- 📊 Real-time analytics and reporting
- 🔐 JWT-based authentication with role-based access
- 📱 Responsive design with Bootstrap 5
- 🎨 Modern UI with animations and transitions
- 📈 Charts and data visualization
- 🌐 Real-time notifications with Socket.io

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Bootstrap 5 & React Bootstrap
- Chart.js for analytics
- Framer Motion for animations
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express
- MySQL with Sequelize ORM
- JWT authentication
- Socket.io for real-time features
- Multer for file uploads
- Helmet for security

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/globetrotter-platform.git
   cd globetrotter-platform
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Setup MySQL Database**
   ```bash
   # Login to MySQL
   mysql -u root -p

   # Create database
   CREATE DATABASE globetrotter_db;

   # Create a user (optional but recommended)
   CREATE USER 'globetrotter_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON globetrotter_db.* TO 'globetrotter_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. **Configure Environment Variables**
   ```bash
   # Copy the environment file
   cp .env .env.local

   # Edit the .env file with your database credentials
   nano .env
   ```

   Update these key variables in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=globetrotter_user
   DB_PASSWORD=your_secure_password
   DB_NAME=globetrotter_db
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure
   ```

6. **Initialize Database**
   ```bash
   # The database will be automatically created when you start the server
   # Tables and default admin user will be created automatically
   ```

7. **Start the Development Server**
   ```bash
   # Start both backend and frontend
   npm run dev

   # Or start them separately:
   # Backend only: npm run server
   # Frontend only: npm run client
   ```

8. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## 🚀 Quick Start Guide

### First Time Setup
1. After starting the application, visit http://localhost:3000
2. You'll see the landing page with login/register options
3. Use the default admin credentials or create a new account

### Default Admin Credentials
- **Email:** admin@globetrotter.com
- **Password:** admin123

### Test the Application
1. **Login as Admin** to see the admin dashboard with analytics
2. **Register as Traveller** to test the trip planning features
3. **Create a test trip** to see the full workflow
4. **Explore public trips** to see community features

## 📱 Dashboard Access by Role

### 🧳 Traveller Dashboard
- **Purpose:** Personal trip planning and management
- **Features:**
  - Create and manage trips
  - Budget tracking and cost breakdown
  - Itinerary builder with activities
  - Share trips publicly or privately
  - Explore community trips
- **Access:** Available to all registered users

### 👑 Admin Dashboard
- **Purpose:** Platform administration and monitoring
- **Features:**
  - User management and analytics
  - Trip moderation and content review
  - Platform statistics and reporting
  - System configuration and settings
- **Access:** Admin role only

### 🗺️ Travel Planner Dashboard
- **Purpose:** Create and share public travel guides
- **Features:**
  - Create public itineraries for community
  - Track engagement (views, likes, copies)
  - Destination analytics and trends
  - Professional travel planning tools
- **Access:** Planner role (register as planner)

### 🏪 Vendor Dashboard
- **Purpose:** Manage travel services and bookings
- **Features:**
  - List travel services (hotels, tours, activities)
  - Manage bookings and customer interactions
  - Revenue tracking and analytics
  - Service performance metrics
- **Access:** Vendor role (register as vendor)

## 🗂️ Project Structure
```
globetrotter-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Dashboard pages
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # Custom CSS
├── server/                # Node.js backend
│   ├── config/           # Database & app config
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── utils/           # Server utilities
└── uploads/             # File uploads
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Run both frontend and backend concurrently
- `npm run server` - Run backend only (port 5000)
- `npm run client` - Run frontend only (port 3000)
- `npm run build` - Build frontend for production
- `npm run install-all` - Install dependencies for both frontend and backend

### Development Workflow
1. **Backend Development:** Make changes in `/server` directory
2. **Frontend Development:** Make changes in `/client/src` directory
3. **Database Changes:** Update models in `/server/models`
4. **API Changes:** Update routes in `/server/routes`
5. **UI Changes:** Update components in `/client/src/components`

### Project Structure Deep Dive
```
globetrotter-platform/
├── server/                 # Node.js Backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers (future)
│   ├── middleware/        # Authentication & validation
│   ├── models/           # Sequelize database models
│   ├── routes/           # Express API routes
│   └── index.js          # Server entry point
├── client/               # React Frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   │   ├── auth/     # Authentication components
│   │   │   ├── dashboards/ # Role-based dashboards
│   │   │   ├── trips/    # Trip management
│   │   │   ├── activities/ # Activity management
│   │   │   ├── layout/   # Navigation & layout
│   │   │   └── common/   # Reusable components
│   │   ├── contexts/     # React contexts (Auth)
│   │   ├── services/     # API service functions
│   │   └── utils/        # Utility functions
├── uploads/              # File upload storage
└── package.json          # Root package configuration
```

## 📊 Database Schema

### Core Tables
- **Users** - User accounts with role-based access (traveller, admin, planner, vendor)
- **Trips** - Trip information with destinations, budgets, and sharing settings
- **Activities** - Individual activities within trips (accommodation, transport, sightseeing)
- **VendorServices** - Services offered by vendors (hotels, tours, equipment)
- **Bookings** - Booking records linking users to vendor services
- **Reviews** - User reviews for trips and vendor services

### Key Relationships
- Users → Trips (One-to-Many)
- Trips → Activities (One-to-Many)
- Users → VendorServices (One-to-Many, for vendors)
- Users → Bookings (One-to-Many)
- VendorServices → Bookings (One-to-Many)

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=globetrotter_production
JWT_SECRET=your_very_secure_production_jwt_secret
```

## 🤝 Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines
- Follow the existing code style and structure
- Add comments for complex logic
- Update README if adding new features
- Test your changes thoroughly
- Ensure responsive design for all screen sizes

## 🐛 Troubleshooting

### Common Issues
1. **Database Connection Error**
   - Check MySQL is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes: `lsof -ti:5000 | xargs kill -9`

3. **Module Not Found Errors**
   - Run `npm install` in root directory
   - Run `npm install` in client directory
   - Clear npm cache: `npm cache clean --force`

## 📄 License
MIT License - see LICENSE file for details

## 🙏 Acknowledgments
- Bootstrap for UI components
- React ecosystem for frontend framework
- Node.js and Express for backend
- MySQL for database
- Chart.js for data visualization
- Framer Motion for animations
=======
# OdooTeam_37

>>>>>>> 3d4c50896493d40e6c932140ff5b1351a0a320ab
