const express = require('express');
const { Op } = require('sequelize');
const { User, Trip, Activity, VendorService, Booking, Review } = require('../models');
const { authenticateToken, requireAdmin, requireVendor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/dashboard/traveller/:userId
// @desc    Get traveller dashboard data
// @access  Private
router.get('/traveller/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Check if user can access this dashboard
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get user's trips
    const trips = await Trip.findAll({
      where: { userId },
      include: [
        {
          model: Activity,
          as: 'activities'
        }
      ],
      order: [['startDate', 'ASC']]
    });

    // Calculate statistics
    const now = new Date();
    const upcomingTrips = trips.filter(trip => new Date(trip.startDate) > now);
    const ongoingTrips = trips.filter(trip => 
      new Date(trip.startDate) <= now && new Date(trip.endDate) >= now
    );
    const completedTrips = trips.filter(trip => new Date(trip.endDate) < now);

    // Calculate total budget and spending
    const totalBudget = trips.reduce((sum, trip) => sum + parseFloat(trip.budget || 0), 0);
    const totalSpent = trips.reduce((sum, trip) => sum + parseFloat(trip.totalCost || 0), 0);

    // Get recent activities
    const recentActivities = await Activity.findAll({
      include: [
        {
          model: Trip,
          as: 'trip',
          where: { userId }
        }
      ],
      order: [['scheduledDate', 'DESC']],
      limit: 5
    });

    // Popular destinations (from user's trips)
    const destinations = trips.flatMap(trip => trip.destinations || []);
    const destinationCounts = destinations.reduce((acc, dest) => {
      acc[dest] = (acc[dest] || 0) + 1;
      return acc;
    }, {});

    const popularDestinations = Object.entries(destinationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([destination, count]) => ({ destination, count }));

    res.json({
      stats: {
        totalTrips: trips.length,
        upcomingTrips: upcomingTrips.length,
        ongoingTrips: ongoingTrips.length,
        completedTrips: completedTrips.length,
        totalBudget,
        totalSpent,
        budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
      },
      upcomingTrips: upcomingTrips.slice(0, 3),
      ongoingTrips,
      recentActivities,
      popularDestinations,
      budgetBreakdown: {
        planned: totalBudget,
        spent: totalSpent,
        remaining: totalBudget - totalSpent
      }
    });
  } catch (error) {
    console.error('Traveller dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard data
// @access  Private (Admin only)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { isActive: true } });
    const newUsersThisMonth = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Get trip statistics
    const totalTrips = await Trip.count();
    const publicTrips = await Trip.count({ where: { isPublic: true } });
    const tripsThisMonth = await Trip.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    });

    // Get user role distribution
    const userRoles = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    // Get popular destinations
    const trips = await Trip.findAll({
      attributes: ['destinations'],
      where: { destinations: { [Op.ne]: null } }
    });

    const allDestinations = trips.flatMap(trip => trip.destinations || []);
    const destinationCounts = allDestinations.reduce((acc, dest) => {
      acc[dest] = (acc[dest] || 0) + 1;
      return acc;
    }, {});

    const popularDestinations = Object.entries(destinationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([destination, count]) => ({ destination, count }));

    // Get monthly trip creation data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrips = await Trip.findAll({
      attributes: [
        [Trip.sequelize.fn('DATE_FORMAT', Trip.sequelize.col('created_at'), '%Y-%m'), 'month'],
        [Trip.sequelize.fn('COUNT', Trip.sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: { [Op.gte]: sixMonthsAgo }
      },
      group: [Trip.sequelize.fn('DATE_FORMAT', Trip.sequelize.col('created_at'), '%Y-%m')],
      order: [[Trip.sequelize.fn('DATE_FORMAT', Trip.sequelize.col('created_at'), '%Y-%m'), 'ASC']]
    });

    // Get recent users
    const recentUsers = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Get budget trends
    const budgetData = await Trip.findAll({
      attributes: [
        'currency',
        [Trip.sequelize.fn('AVG', Trip.sequelize.col('budget')), 'avgBudget'],
        [Trip.sequelize.fn('COUNT', Trip.sequelize.col('id')), 'tripCount']
      ],
      where: { budget: { [Op.ne]: null } },
      group: ['currency']
    });

    res.json({
      userStats: {
        total: totalUsers,
        active: activeUsers,
        newThisMonth: newUsersThisMonth,
        roles: userRoles.map(role => ({
          role: role.role,
          count: parseInt(role.dataValues.count)
        }))
      },
      tripStats: {
        total: totalTrips,
        public: publicTrips,
        newThisMonth: tripsThisMonth
      },
      popularDestinations,
      monthlyTrends: monthlyTrips.map(item => ({
        month: item.dataValues.month,
        trips: parseInt(item.dataValues.count)
      })),
      recentUsers,
      budgetTrends: budgetData.map(item => ({
        currency: item.currency,
        avgBudget: parseFloat(item.dataValues.avgBudget),
        tripCount: parseInt(item.dataValues.tripCount)
      }))
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/dashboard/vendor/:vendorId
// @desc    Get vendor dashboard data
// @access  Private (Vendor only)
router.get('/vendor/:vendorId', authenticateToken, requireVendor, async (req, res) => {
  try {
    const vendorId = parseInt(req.params.vendorId);
    
    // Check if user can access this dashboard
    if (req.user.id !== vendorId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get vendor's services
    const services = await VendorService.findAll({
      where: { vendorId },
      include: [
        {
          model: Booking,
          as: 'bookings'
        },
        {
          model: Review,
          as: 'reviews'
        }
      ]
    });

    // Calculate statistics
    const totalServices = services.length;
    const activeServices = services.filter(service => service.isActive).length;
    const totalBookings = services.reduce((sum, service) => sum + (service.bookings?.length || 0), 0);
    const totalRevenue = services.reduce((sum, service) => 
      sum + (service.bookings?.reduce((bookingSum, booking) => 
        bookingSum + parseFloat(booking.totalAmount || 0), 0) || 0), 0
    );

    // Get recent bookings
    const recentBookings = await Booking.findAll({
      include: [
        {
          model: VendorService,
          as: 'service',
          where: { vendorId }
        },
        {
          model: User,
          as: 'user',
          attributes: ['firstName', 'lastName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Service performance
    const servicePerformance = services.map(service => ({
      id: service.id,
      title: service.title,
      bookings: service.bookings?.length || 0,
      revenue: service.bookings?.reduce((sum, booking) => 
        sum + parseFloat(booking.totalAmount || 0), 0) || 0,
      rating: parseFloat(service.rating || 0),
      reviewCount: service.reviews?.length || 0
    }));

    res.json({
      stats: {
        totalServices,
        activeServices,
        totalBookings,
        totalRevenue,
        avgRating: services.reduce((sum, service) => sum + parseFloat(service.rating || 0), 0) / totalServices || 0
      },
      recentBookings,
      servicePerformance,
      monthlyRevenue: [], // TODO: Implement monthly revenue calculation
      topServices: servicePerformance
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
    });
  } catch (error) {
    console.error('Vendor dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/dashboard/planner/:plannerId
// @desc    Get planner dashboard data
// @access  Private (Planner only)
router.get('/planner/:plannerId', authenticateToken, async (req, res) => {
  try {
    const plannerId = parseInt(req.params.plannerId);

    // Check if user can access this dashboard
    if (req.user.id !== plannerId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get planner's public trips
    const publicTrips = await Trip.findAll({
      where: {
        userId: plannerId,
        isPublic: true
      },
      include: [
        {
          model: Activity,
          as: 'activities'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Calculate engagement stats
    const totalViews = publicTrips.reduce((sum, trip) => sum + (trip.views || 0), 0);
    const totalLikes = publicTrips.reduce((sum, trip) => sum + (trip.likes || 0), 0);
    const totalCopies = publicTrips.reduce((sum, trip) => sum + (trip.copies || 0), 0);

    // Get top performing trips
    const topTrips = publicTrips
      .sort((a, b) => (b.views + b.likes + b.copies) - (a.views + a.likes + a.copies))
      .slice(0, 5);

    // Get follower cities (most popular destinations in planner's trips)
    const destinations = publicTrips.flatMap(trip => trip.destinations || []);
    const destinationCounts = destinations.reduce((acc, dest) => {
      acc[dest] = (acc[dest] || 0) + 1;
      return acc;
    }, {});

    const topDestinations = Object.entries(destinationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([destination, count]) => ({ destination, count }));

    res.json({
      stats: {
        totalPublicTrips: publicTrips.length,
        totalViews,
        totalLikes,
        totalCopies,
        avgEngagement: publicTrips.length > 0 ? (totalViews + totalLikes + totalCopies) / publicTrips.length : 0
      },
      publicTrips: publicTrips.slice(0, 10),
      topTrips,
      topDestinations,
      engagementTrends: [] // TODO: Implement engagement trends
    });
  } catch (error) {
    console.error('Planner dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
