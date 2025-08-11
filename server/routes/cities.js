const express = require('express');
const { Op } = require('sequelize');
const { City } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cities
// @desc    Get all cities
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, popular } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${search}%` } },
          { country: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }
    
    if (popular === 'true') {
      whereClause.isPopular = true;
    }

    const cities = await City.findAll({
      where: whereClause,
      order: [
        ['isPopular', 'DESC'],
        ['name', 'ASC']
      ]
    });

    res.json({ cities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// @route   GET /api/cities/:id
// @desc    Get city by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    
    if (!city) {
      return res.status(404).json({ error: 'City not found' });
    }

    res.json({ city });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
