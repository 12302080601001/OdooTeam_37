import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ActivitySearch = () => {
  const { tripId } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minCost: '',
    maxCost: '',
    maxDuration: '',
    search: ''
  });

  const activityCategories = [
    { id: 'sightseeing', name: 'Sightseeing', icon: 'fas fa-camera', color: '#3b82f6' },
    { id: 'culture', name: 'Culture', icon: 'fas fa-university', color: '#8b5cf6' },
    { id: 'food', name: 'Food & Dining', icon: 'fas fa-utensils', color: '#ef4444' },
    { id: 'adventure', name: 'Adventure', icon: 'fas fa-mountain', color: '#10b981' },
    { id: 'entertainment', name: 'Entertainment', icon: 'fas fa-music', color: '#f59e0b' },
    { id: 'shopping', name: 'Shopping', icon: 'fas fa-shopping-bag', color: '#ec4899' },
    { id: 'nature', name: 'Nature', icon: 'fas fa-tree', color: '#059669' },
    { id: 'sports', name: 'Sports', icon: 'fas fa-futbol', color: '#dc2626' }
  ];

  useEffect(() => {
    fetchData();
  }, [tripId]);

  useEffect(() => {
    applyFilters();
  }, [activities, filters]);

  const fetchData = async () => {
    try {
      // Get trip data
      const tripResponse = await axios.get(`/api/trips/${tripId}`);
      const tripData = tripResponse.data.trip;

      if (!tripData) {
        toast.error('Trip not found');
        return;
      }
      setTrip(tripData);

      // Get all available activities
      const activitiesResponse = await axios.get('/api/activities');
      const allActivities = activitiesResponse.data.activities || [];

      // Get all cities
      const citiesResponse = await axios.get('/api/cities');
      setCities(citiesResponse.data.cities || []);

      // Get cities from trip destinations
      const tripCityIds = tripData.destinations?.map(dest => dest.cityId) || [];

      // Filter activities for trip cities, or show all if no destinations
      const relevantActivities = tripCityIds.length > 0
        ? allActivities.filter(activity => tripCityIds.includes(activity.cityId))
        : allActivities;

      setActivities(relevantActivities);

      // Get already selected activities for this trip
      const tripActivitiesResponse = await axios.get(`/api/trips/${tripId}/activities`);
      const tripActivities = tripActivitiesResponse.data.activities || [];
      setSelectedActivities(tripActivities.map(act => act.activityId || act.id));

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...activities];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(activity => activity.category === filters.category);
    }

    // Cost filters
    if (filters.minCost) {
      filtered = filtered.filter(activity => activity.averageCost >= parseFloat(filters.minCost));
    }
    if (filters.maxCost) {
      filtered = filtered.filter(activity => activity.averageCost <= parseFloat(filters.maxCost));
    }

    // Duration filter
    if (filters.maxDuration) {
      filtered = filtered.filter(activity => activity.duration <= parseFloat(filters.maxDuration));
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredActivities(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minCost: '',
      maxCost: '',
      maxDuration: '',
      search: ''
    });
  };

  const handleAddActivity = async (activity) => {
    try {
      const activityData = {
        activityId: activity.id,
        name: activity.name,
        description: activity.description,
        category: activity.category,
        cost: activity.averageCost,
        duration: activity.duration,
        date: trip.startDate, // Default to trip start date
        time: '09:00', // Default time
        destinationId: trip.destinations?.[0]?.id || null
      };

      await axios.post(`/api/trips/${tripId}/activities`, activityData);

      setSelectedActivities(prev => [...prev, activity.id]);

      toast.success(`${activity.name} added to your trip!`);
    } catch (error) {
      console.error('Error adding activity:', error);
      toast.error('Failed to add activity');
    }
  };

  const handleRemoveActivity = async (activityId) => {
    try {
      await axios.delete(`/api/trips/${tripId}/activities/${activityId}`);

      setSelectedActivities(prev => prev.filter(id => id !== activityId));

      toast.success('Activity removed from your trip');
    } catch (error) {
      console.error('Error removing activity:', error);
      toast.error('Failed to remove activity');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Trip not found
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
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
              <h2 className="font-poppins mb-1">
                <i className="fas fa-search me-2 text-primary"></i>
                Activity Search
              </h2>
              <p className="text-muted mb-0">Find and add activities to "{trip.title}"</p>
            </div>
            <div className="d-flex gap-2">
              <span className="badge bg-primary fs-6">
                {selectedActivities.length} Selected
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="card card-modern">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">
                  <i className="fas fa-filter me-2"></i>
                  Filters
                </h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <i className="fas fa-times me-1"></i>
                  Clear All
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Search</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search activities..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Category</label>
                    <select
                      className="form-select"
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {activityCategories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Min Cost</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="0"
                      value={filters.minCost}
                      onChange={(e) => handleFilterChange('minCost', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Max Cost</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="1000"
                      value={filters.maxCost}
                      onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Max Duration (hours)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="8"
                      value={filters.maxDuration}
                      onChange={(e) => handleFilterChange('maxDuration', e.target.value)}
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div variants={itemVariants} className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              <i className="fas fa-list me-2"></i>
              Available Activities ({filteredActivities.length})
            </h5>
            <div className="d-flex gap-2">
              <small className="text-muted">
                Showing {filteredActivities.length} of {activities.length} activities
              </small>
            </div>
          </div>

          {filteredActivities.length > 0 ? (
            <div className="row">
              {filteredActivities.map(activity => {
                const category = activityCategories.find(cat => cat.id === activity.category);
                const isSelected = selectedActivities.includes(activity.id);
                const city = cities.find(c => c.id === activity.cityId);

                return (
                  <div key={activity.id} className="col-md-6 col-lg-4 mb-4">
                    <motion.div
                      variants={itemVariants}
                      className={`card card-modern h-100 ${isSelected ? 'border-success' : ''}`}
                      style={{ position: 'relative' }}
                    >
                      {/* Activity Image */}
                      <div className="position-relative">
                        <img
                          src={activity.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=250&fit=crop'}
                          alt={activity.name}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />

                        {/* Category Badge */}
                        <div className="position-absolute top-0 start-0 m-2">
                          <span
                            className="badge"
                            style={{ backgroundColor: category?.color, color: 'white' }}
                          >
                            <i className={`${category?.icon} me-1`}></i>
                            {category?.name}
                          </span>
                        </div>

                        {/* Selected Badge */}
                        {isSelected && (
                          <div className="position-absolute top-0 end-0 m-2">
                            <span className="badge bg-success">
                              <i className="fas fa-check me-1"></i>
                              Added
                            </span>
                          </div>
                        )}

                        {/* Rating */}
                        <div className="position-absolute bottom-0 start-0 m-2">
                          <span className="badge bg-dark bg-opacity-75">
                            <i className="fas fa-star text-warning me-1"></i>
                            {activity.rating || '4.5'}
                          </span>
                        </div>
                      </div>

                      <div className="card-body d-flex flex-column">
                        <div className="flex-grow-1">
                          <h5 className="card-title">{activity.name}</h5>
                          <p className="card-text text-muted small mb-2">
                            {activity.description}
                          </p>

                          {city && (
                            <p className="card-text">
                              <small className="text-muted">
                                <i className="fas fa-map-marker-alt me-1"></i>
                                {city.name}, {city.country}
                              </small>
                            </p>
                          )}

                          {/* Activity Details */}
                          <div className="row text-center mb-3">
                            <div className="col-4">
                              <div className="border-end">
                                <div className="fw-bold text-primary">
                                  ${activity.averageCost}
                                </div>
                                <small className="text-muted">Cost</small>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="border-end">
                                <div className="fw-bold text-info">
                                  {activity.duration}h
                                </div>
                                <small className="text-muted">Duration</small>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="fw-bold text-warning">
                                {activity.rating || '4.5'}
                              </div>
                              <small className="text-muted">Rating</small>
                            </div>
                          </div>

                          {/* Highlights */}
                          {activity.highlights && activity.highlights.length > 0 && (
                            <div className="mb-3">
                              <small className="text-muted d-block mb-1">Highlights:</small>
                              <div className="d-flex flex-wrap gap-1">
                                {activity.highlights.slice(0, 3).map((highlight, index) => (
                                  <span key={index} className="badge bg-light text-dark">
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="mt-auto">
                          {isSelected ? (
                            <button
                              className="btn btn-outline-danger w-100"
                              onClick={() => handleRemoveActivity(activity.id)}
                            >
                              <i className="fas fa-minus me-2"></i>
                              Remove from Trip
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary w-100"
                              onClick={() => handleAddActivity(activity)}
                            >
                              <i className="fas fa-plus me-2"></i>
                              Add to Trip
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h5 className="text-muted">No activities found</h5>
              <p className="text-muted">
                Try adjusting your filters or search terms to find more activities.
              </p>
              <button
                className="btn btn-outline-primary"
                onClick={clearFilters}
              >
                <i className="fas fa-refresh me-2"></i>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Selected Activities Summary */}
      {selectedActivities.length > 0 && (
        <motion.div variants={itemVariants} className="row">
          <div className="col-12">
            <div className="card card-modern bg-light">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      {selectedActivities.length} Activities Added to Your Trip
                    </h6>
                    <small className="text-muted">
                      You can view and manage these activities in your trip itinerary.
                    </small>
                  </div>
                  <div>
                    <a
                      href={`/trips/${tripId}/itinerary`}
                      className="btn btn-success btn-modern"
                    >
                      <i className="fas fa-calendar-alt me-2"></i>
                      View Itinerary
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ActivitySearch;
