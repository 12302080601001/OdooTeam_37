const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Activity = sequelize.define('Activity', {
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
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM(
      'accommodation', 'transportation', 'food', 'sightseeing', 
      'adventure', 'cultural', 'shopping', 'entertainment', 
      'relaxation', 'business', 'other'
    ),
    allowNull: false
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
    allowNull: true,
    validate: {
      isValidCoordinates(value) {
        if (value && (!value.lat || !value.lng)) {
          throw new Error('Coordinates must include lat and lng');
        }
      }
    }
  },
  scheduledDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'must-do'),
    defaultValue: 'medium'
  },
  status: {
    type: DataTypes.ENUM('planned', 'booked', 'completed', 'cancelled', 'skipped'),
    defaultValue: 'planned'
  },
  bookingReference: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  bookingUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactInfo: {
    type: DataTypes.JSON,
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
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  weatherConditions: {
    type: DataTypes.JSON,
    allowNull: true
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
  ageRestrictions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  }
}, {
  tableName: 'activities',
  indexes: [
    {
      fields: ['trip_id']
    },
    {
      fields: ['category']
    },
    {
      fields: ['scheduled_date']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    }
  ]
});

// Instance methods
Activity.prototype.isUpcoming = function() {
  return new Date(this.scheduledDate) > new Date();
};

Activity.prototype.isToday = function() {
  const today = new Date().toISOString().split('T')[0];
  return this.scheduledDate === today;
};

Activity.prototype.getFormattedTime = function() {
  if (this.startTime && this.endTime) {
    return `${this.startTime} - ${this.endTime}`;
  } else if (this.startTime) {
    return `From ${this.startTime}`;
  }
  return 'Time TBD';
};

Activity.prototype.getDurationHours = function() {
  if (this.duration) {
    return Math.round((this.duration / 60) * 100) / 100;
  }
  return null;
};

module.exports = Activity;
