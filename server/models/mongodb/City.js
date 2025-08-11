const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  countryCode: {
    type: String,
    required: true,
    uppercase: true,
    length: 2
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  timezone: {
    type: String,
    required: true
  },
  population: {
    type: Number
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    url: String,
    caption: String
  }],
  bestTimeToVisit: {
    months: [{
      type: String,
      enum: ['January', 'February', 'March', 'April', 'May', 'June', 
             'July', 'August', 'September', 'October', 'November', 'December']
    }],
    description: String
  },
  averageTemperature: {
    summer: {
      min: Number,
      max: Number
    },
    winter: {
      min: Number,
      max: Number
    },
    unit: {
      type: String,
      enum: ['celsius', 'fahrenheit'],
      default: 'celsius'
    }
  },
  currency: {
    code: String,
    name: String,
    symbol: String
  },
  languages: [{
    type: String
  }],
  attractions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  isPopular: {
    type: Boolean,
    default: false
  },
  visitCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient searching
citySchema.index({ name: 'text', country: 'text', tags: 'text' });
citySchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('City', citySchema);
