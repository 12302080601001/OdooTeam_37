const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Trip title is required' },
      len: { args: [3, 200], msg: 'Title must be between 3 and 200 characters' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Start date is required' },
      isDate: { msg: 'Start date must be a valid date' }
    }
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'End date is required' },
      isDate: { msg: 'End date must be a valid date' },
      isAfterStartDate(value) {
        if (value <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Budget cannot be negative' }
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  status: {
    type: DataTypes.ENUM('planning', 'confirmed', 'ongoing', 'completed', 'cancelled'),
    defaultValue: 'planning'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  coverImage: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  destinations: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Total cost cannot be negative' }
    }
  },
  participantCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'Participant count must be at least 1' }
    }
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'moderate', 'challenging', 'extreme'),
    defaultValue: 'easy'
  },
  travelStyle: {
    type: DataTypes.ENUM('budget', 'mid-range', 'luxury', 'backpacking', 'family', 'business'),
    defaultValue: 'mid-range'
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Likes cannot be negative' }
    }
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Views cannot be negative' }
    }
  },
  copies: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: 'Copies cannot be negative' }
    }
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    allowNull: true,
    validate: {
      min: { args: [1], msg: 'Rating must be at least 1' },
      max: { args: [5], msg: 'Rating cannot exceed 5' }
    }
  },
  weatherInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'trips',
  timestamps: true
});

// Instance methods
Trip.prototype.getDuration = function() {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

Trip.prototype.isUpcoming = function() {
  return new Date(this.startDate) > new Date();
};

Trip.prototype.isOngoing = function() {
  const now = new Date();
  return new Date(this.startDate) <= now && new Date(this.endDate) >= now;
};

Trip.prototype.isCompleted = function() {
  return new Date(this.endDate) < new Date();
};

// Add indexes
Trip.addHook('afterSync', async () => {
  console.log('✅ Trip model synchronized with indexes');
});

module.exports = Trip;
