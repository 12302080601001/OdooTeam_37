const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VendorService = sequelize.define('VendorService', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'hotel', 'restaurant', 'tour', 'transport', 'activity', 
      'guide', 'equipment', 'insurance', 'visa', 'other'
    ),
    allowNull: false
  },
  serviceType: {
    type: DataTypes.ENUM('product', 'service', 'experience'),
    defaultValue: 'service'
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  coordinates: {
    type: DataTypes.JSON,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  priceType: {
    type: DataTypes.ENUM('per_person', 'per_group', 'per_hour', 'per_day', 'fixed'),
    defaultValue: 'per_person'
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1
    }
  },
  availability: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      timeSlots: [],
      blackoutDates: []
    }
  },
  features: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  inclusions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  exclusions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  cancellationPolicy: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  contactInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },
  socialMedia: {
    type: DataTypes.JSON,
    allowNull: true
  },
  certifications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  languages: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: ['english']
  },
  accessibility: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      wheelchairAccessible: false,
      petFriendly: false,
      familyFriendly: true
    }
  },
  seasonality: {
    type: DataTypes.JSON,
    allowNull: true
  },
  bookingLeadTime: {
    type: DataTypes.INTEGER, // hours
    defaultValue: 24
  },
  instantBooking: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'vendor_services',
  indexes: [
    {
      fields: ['vendor_id']
    },
    {
      fields: ['category']
    },
    {
      fields: ['location']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['rating']
    },
    {
      fields: ['price']
    }
  ]
});

// Instance methods
VendorService.prototype.getFormattedPrice = function() {
  return `${this.currency} ${this.price}`;
};

VendorService.prototype.isAvailableOn = function(date) {
  if (!this.availability || !this.availability.blackoutDates) {
    return true;
  }
  return !this.availability.blackoutDates.includes(date);
};

VendorService.prototype.getDurationHours = function() {
  if (this.duration) {
    return Math.round((this.duration / 60) * 100) / 100;
  }
  return null;
};

module.exports = VendorService;
