const express = require('express');
const { VendorService } = require('../models');
const { authenticateToken, requireVendor } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/vendors/services
// @desc    Get vendor services
// @access  Public
router.get('/services', async (req, res) => {
  try {
    const { category, location, page = 1, limit = 10 } = req.query;
    const where = { isActive: true };
    
    if (category) where.category = category;
    if (location) where.location = { [Op.like]: `%${location}%` };

    const services = await VendorService.findAndCountAll({
      where,
      order: [['rating', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (page - 1) * limit
    });

    res.json({
      services: services.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(services.count / limit),
        totalItems: services.count
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
