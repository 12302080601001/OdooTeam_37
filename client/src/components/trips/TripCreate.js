import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axios';

const TripCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD',
    destinations: [],
    tags: [],
    isPublic: false,
    participantCount: 1,
    difficulty: 'easy',
    travelStyle: 'mid-range'
  });

  const [destinationInput, setDestinationInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addDestination = () => {
    if (destinationInput.trim() && !formData.destinations.includes(destinationInput.trim())) {
      setFormData(prev => ({
        ...prev,
        destinations: [...prev.destinations, destinationInput.trim()]
      }));
      setDestinationInput('');
    }
  };

  const removeDestination = (destination) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.filter(d => d !== destination)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate dates
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        toast.error('End date must be after start date');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.post('/api/trips', formData);

      toast.success('Trip created successfully!');
      navigate(`/trips/${response.data.trip.id}`);
    } catch (error) {
      console.error('Create trip error:', error);
      const message = error.response?.data?.details || error.response?.data?.error || 'Failed to create trip';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container-fluid"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="font-poppins mb-1">Create New Trip</h2>
              <p className="text-muted mb-0">Plan your next adventure with detailed itinerary</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/trips')}
              className="btn btn-outline-secondary btn-modern"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Trips
            </button>
          </div>
        </div>
      </motion.div>

      {/* Trip Creation Form */}
      <motion.div variants={itemVariants} className="row">
        <div className="col-12">
          <div className="card card-modern">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Basic Information */}
                  <div className="col-md-8">
                    <h5 className="mb-3">
                      <i className="fas fa-info-circle me-2 text-primary"></i>
                      Basic Information
                    </h5>

                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Trip Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter trip title"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your trip..."
                      ></textarea>
                    </div>

                    {/* Dates */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="startDate" className="form-label">Start Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          id="startDate"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="endDate" className="form-label">End Date *</label>
                        <input
                          type="date"
                          className="form-control"
                          id="endDate"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          min={formData.startDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Trip Settings */}
                  <div className="col-md-4">
                    <h5 className="mb-3">
                      <i className="fas fa-cog me-2 text-primary"></i>
                      Trip Settings
                    </h5>

                    {/* Budget */}
                    <div className="row mb-3">
                      <div className="col-8">
                        <label htmlFor="budget" className="form-label">Budget</label>
                        <input
                          type="number"
                          className="form-control"
                          id="budget"
                          name="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          placeholder="0"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-4">
                        <label htmlFor="currency" className="form-label">Currency</label>
                        <select
                          className="form-select"
                          id="currency"
                          name="currency"
                          value={formData.currency}
                          onChange={handleChange}
                        >
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="GBP">GBP</option>
                          <option value="INR">INR</option>
                          <option value="JPY">JPY</option>
                        </select>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="mb-3">
                      <label htmlFor="participantCount" className="form-label">Participants</label>
                      <input
                        type="number"
                        className="form-control"
                        id="participantCount"
                        name="participantCount"
                        value={formData.participantCount}
                        onChange={handleChange}
                        min="1"
                        max="50"
                      />
                    </div>

                    {/* Difficulty */}
                    <div className="mb-3">
                      <label htmlFor="difficulty" className="form-label">Difficulty</label>
                      <select
                        className="form-select"
                        id="difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                      >
                        <option value="easy">Easy</option>
                        <option value="moderate">Moderate</option>
                        <option value="challenging">Challenging</option>
                        <option value="extreme">Extreme</option>
                      </select>
                    </div>

                    {/* Travel Style */}
                    <div className="mb-3">
                      <label htmlFor="travelStyle" className="form-label">Travel Style</label>
                      <select
                        className="form-select"
                        id="travelStyle"
                        name="travelStyle"
                        value={formData.travelStyle}
                        onChange={handleChange}
                      >
                        <option value="budget">Budget</option>
                        <option value="mid-range">Mid-range</option>
                        <option value="luxury">Luxury</option>
                        <option value="backpacking">Backpacking</option>
                        <option value="family">Family</option>
                        <option value="business">Business</option>
                      </select>
                    </div>

                    {/* Public Trip */}
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="isPublic"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="isPublic">
                        Make trip public
                      </label>
                    </div>
                  </div>
                </div>

                {/* Destinations */}
                <div className="row mt-4">
                  <div className="col-md-6">
                    <h5 className="mb-3">
                      <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                      Destinations
                    </h5>

                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add destination"
                        value={destinationInput}
                        onChange={(e) => setDestinationInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDestination())}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={addDestination}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      {formData.destinations.map((destination, index) => (
                        <span key={index} className="badge bg-primary d-flex align-items-center">
                          {destination}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: '0.7em' }}
                            onClick={() => removeDestination(destination)}
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="col-md-6">
                    <h5 className="mb-3">
                      <i className="fas fa-tags me-2 text-primary"></i>
                      Tags
                    </h5>

                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={addTag}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span key={index} className="badge bg-secondary d-flex align-items-center">
                          {tag}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-2"
                            style={{ fontSize: '0.7em' }}
                            onClick={() => removeTag(tag)}
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="row mt-4">
                  <div className="col-12">
                    <div className="d-flex justify-content-end gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-modern"
                        onClick={() => navigate('/trips')}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-gradient btn-modern"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="loading-spinner me-2"></span>
                            Creating Trip...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-plus me-2"></i>
                            Create Trip
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TripCreate;
