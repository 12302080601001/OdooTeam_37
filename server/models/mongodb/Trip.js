const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destinations: [{
    name: {
      type: String,
      required: true
    },
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'planning'
  },
  budget: {
    total: {
      type: Number,
      default: 0
    },
    spent: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    role: {
      type: String,
      enum: ['organizer', 'participant'],
      default: 'participant'
    }
  }],
  itinerary: [{
    day: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    activities: [{
      activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
      },
      title: String,
      description: String,
      startTime: String,
      endTime: String,
      location: String,
      cost: {
        type: Number,
        default: 0
      },
      category: {
        type: String,
        enum: ['sightseeing', 'food', 'adventure', 'relaxation', 'culture', 'shopping', 'transport']
      }
    }]
  }],
  expenses: [{
    title: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: ['accommodation', 'transport', 'food', 'activities', 'shopping', 'other'],
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    description: String,
    receipt: String // URL to receipt image
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate trip duration
tripSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return 0;
});

// Calculate budget remaining
tripSchema.virtual('budgetRemaining').get(function() {
  return this.budget.total - this.budget.spent;
});

// Ensure virtual fields are serialized
tripSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Trip', tripSchema);
