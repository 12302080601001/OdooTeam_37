const express = require('express');
const { Op } = require('sequelize');
const Joi = require('joi');
const { Trip, Activity, User } = require('../models');
const { authenticateToken, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation schema
const tripSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().optional(),
  startDate: Joi.date().min('now').required(),
  endDate: Joi.date().greater(Joi.ref('startDate')).required(),
  budget: Joi.number().min(0).optional(),
  currency: Joi.string().length(3).default('USD'),
  destinations: Joi.array().items(Joi.string()).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublic: Joi.boolean().default(false),
  participantCount: Joi.number().min(1).default(1),
  difficulty: Joi.string().valid('easy', 'moderate', 'challenging', 'extreme').default('easy'),
  travelStyle: Joi.string().valid('budget', 'mid-range', 'luxury', 'backpacking', 'family', 'business').default('mid-range')
});

// @route   GET /api/trips
// @desc    Get all trips (with filters)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      isPublic, 
      destination,
      userId,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (status) where.status = status;
    if (isPublic !== undefined) where.isPublic = isPublic === 'true';
    if (destination) {
      where.destinations = {
        [Op.like]: `%${destination}%`
      };
    }
    
    // If not admin, only show user's own trips or public trips
    if (req.user.role !== 'admin') {
      if (userId && parseInt(userId) === req.user.id) {
        where.userId = req.user.id;
      } else {
        where[Op.or] = [
          { userId: req.user.id },
          { isPublic: true }
        ];
      }
    } else if (userId) {
      where.userId = userId;
    }

    const trips = await Trip.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: Activity,
          as: 'activities',
          limit: 3,
          order: [['scheduledDate', 'ASC']]
        }
      ],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      trips: trips.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(trips.count / limit),
        totalItems: trips.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/trips/:id
// @desc    Get single trip
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: Activity,
          as: 'activities',
          order: [['scheduledDate', 'ASC'], ['startTime', 'ASC']]
        }
      ]
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check access permissions
    if (!trip.isPublic && trip.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Increment view count if viewing someone else's public trip
    if (trip.isPublic && trip.userId !== req.user.id) {
      await trip.increment('views');
    }

    res.json({ trip });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/trips
// @desc    Create new trip
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = tripSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const trip = await Trip.create({
      ...value,
      userId: req.user.id
    });

    const tripWithUser = await Trip.findByPk(trip.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }
      ]
    });

    res.status(201).json({
      message: 'Trip created successfully',
      trip: tripWithUser
    });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   PUT /api/trips/:id
// @desc    Update trip
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check ownership
    if (trip.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error, value } = tripSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    await trip.update(value);

    const updatedTrip = await Trip.findByPk(trip.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        },
        {
          model: Activity,
          as: 'activities'
        }
      ]
    });

    res.json({
      message: 'Trip updated successfully',
      trip: updatedTrip
    });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   DELETE /api/trips/:id
// @desc    Delete trip
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check ownership
    if (trip.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await trip.destroy();

    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/trips/:id/like
// @desc    Like/unlike a trip
// @access  Private
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (!trip.isPublic) {
      return res.status(403).json({ error: 'Cannot like private trip' });
    }

    // For simplicity, just increment likes (in real app, track user likes)
    await trip.increment('likes');

    res.json({ 
      message: 'Trip liked successfully',
      likes: trip.likes + 1
    });
  } catch (error) {
    console.error('Like trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/trips/:id/copy
// @desc    Copy a public trip
// @access  Private
router.post('/:id/copy', authenticateToken, async (req, res) => {
  try {
    const originalTrip = await Trip.findByPk(req.params.id, {
      include: [{ model: Activity, as: 'activities' }]
    });
    
    if (!originalTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (!originalTrip.isPublic) {
      return res.status(403).json({ error: 'Cannot copy private trip' });
    }

    // Create copy of trip
    const tripCopy = await Trip.create({
      title: `${originalTrip.title} (Copy)`,
      description: originalTrip.description,
      startDate: req.body.startDate || originalTrip.startDate,
      endDate: req.body.endDate || originalTrip.endDate,
      budget: originalTrip.budget,
      currency: originalTrip.currency,
      destinations: originalTrip.destinations,
      tags: originalTrip.tags,
      participantCount: originalTrip.participantCount,
      difficulty: originalTrip.difficulty,
      travelStyle: originalTrip.travelStyle,
      userId: req.user.id,
      isPublic: false
    });

    // Copy activities
    if (originalTrip.activities && originalTrip.activities.length > 0) {
      const activitiesCopy = originalTrip.activities.map(activity => ({
        title: activity.title,
        description: activity.description,
        category: activity.category,
        location: activity.location,
        address: activity.address,
        coordinates: activity.coordinates,
        scheduledDate: activity.scheduledDate,
        startTime: activity.startTime,
        endTime: activity.endTime,
        duration: activity.duration,
        cost: activity.cost,
        currency: activity.currency,
        priority: activity.priority,
        tags: activity.tags,
        tripId: tripCopy.id
      }));

      await Activity.bulkCreate(activitiesCopy);
    }

    // Increment copy count
    await originalTrip.increment('copies');

    res.status(201).json({
      message: 'Trip copied successfully',
      trip: tripCopy
    });
  } catch (error) {
    console.error('Copy trip error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
