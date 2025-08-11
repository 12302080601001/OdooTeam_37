const express = require('express');
const Joi = require('joi');
const { Activity, Trip } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const activitySchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  description: Joi.string().optional(),
  category: Joi.string().valid(
    'accommodation', 'transportation', 'food', 'sightseeing', 
    'adventure', 'cultural', 'shopping', 'entertainment', 
    'relaxation', 'business', 'other'
  ).required(),
  location: Joi.string().required(),
  address: Joi.string().optional(),
  coordinates: Joi.object({
    lat: Joi.number().required(),
    lng: Joi.number().required()
  }).optional(),
  scheduledDate: Joi.date().required(),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  duration: Joi.number().min(0).optional(),
  cost: Joi.number().min(0).default(0),
  currency: Joi.string().length(3).default('USD'),
  priority: Joi.string().valid('low', 'medium', 'high', 'must-do').default('medium'),
  tags: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().optional()
});

// @route   GET /api/activities/trip/:tripId
// @desc    Get activities for a trip
// @access  Private
router.get('/trip/:tripId', authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.tripId);
    
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Check access permissions
    if (!trip.isPublic && trip.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const activities = await Activity.findAll({
      where: { tripId: req.params.tripId },
      order: [['scheduledDate', 'ASC'], ['startTime', 'ASC']]
    });

    res.json({ activities });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   POST /api/activities
// @desc    Create new activity
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { error, value } = activitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    // Verify trip ownership
    const trip = await Trip.findByPk(req.body.tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const activity = await Activity.create({
      ...value,
      tripId: req.body.tripId
    });

    res.status(201).json({
      message: 'Activity created successfully',
      activity
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id, {
      include: [{ model: Trip, as: 'trip' }]
    });
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Check ownership
    if (activity.trip.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { error, value } = activitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    await activity.update(value);

    res.json({
      message: 'Activity updated successfully',
      activity
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete activity
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id, {
      include: [{ model: Trip, as: 'trip' }]
    });
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Check ownership
    if (activity.trip.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await activity.destroy();

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
